---
sidebar_position: 9
sidebar_label: "TLS/SSL for Helm and Tiller"
slug: using-ssl-between-helm-and-tiller
---

# Using SSL Between Helm and Tiller

This document explains how to create strong SSL/TLS connections between Helm and
Tiller. The emphasis here is on creating an internal CA, and using both the
cryptographic and identity functions of SSL.

> Support for TLS-based auth was introduced in Helm 2.3.0

Configuring SSL is considered an advanced topic, and knowledge of Helm and Tiller
is assumed.

## Overview

The Tiller authentication model uses client-side SSL certificates. Tiller itself
verifies these certificates using a certificate authority. Likewise, the client
also verifies Tiller's identity by certificate authority.

There are numerous possible configurations for setting up certificates and authorities,
but the method we cover here will work for most situations.

> As of Helm 2.7.2, Tiller _requires_ that the client certificate be validated
> by its CA. In prior versions, Tiller used a weaker validation strategy that
> allowed self-signed certificates.

In this guide, we will show how to:

- Create a private CA that is used to issue certificates for Tiller clients and
  servers.
- Create a certificate for Tiller
- Create a certificate for the Helm client
- Create a Tiller instance that uses the certificate
- Configure the Helm client to use the CA and client-side certificate

By the end of this guide, you should have a Tiller instance running that will
only accept connections from clients who can be authenticated by SSL certificate.

## Generating Certificate Authorities and Certificates

One way to generate SSL CAs is via the `openssl` command line tool. There are many
guides and best practices documents available online. This explanation is focused
on getting ready within a small amount of time. For production configurations,
we urge readers to read [the official documentation](https://www.openssl.org) and
consult other resources.

There are other alternative ways to generating SSL CAs in addition to `openssl`, for example Terraform. They are not documented here but you can find links to these alternative means in [Related Projects and Documentation](https://helm.sh/docs/related/).

### Generate a Certificate Authority

The simplest way to generate a certificate authority is to run two commands:

```console
$ openssl genrsa -out ./ca.key.pem 4096
$ openssl req -key ca.key.pem -new -x509 -days 7300 -sha256 -out ca.cert.pem -extensions v3_ca
Enter pass phrase for ca.key.pem:
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:CO
Locality Name (eg, city) []:Boulder
Organization Name (eg, company) [Internet Widgits Pty Ltd]:tiller
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:tiller
Email Address []:tiller@example.com
```

Note that the data input above is _sample data_. You should customize to your own
specifications.

The above will generate both a secret key and a CA. Note that these two files are
very important. The key in particular should be handled with particular care.

Often, you will want to generate an intermediate signing key. For the sake of brevity,
we will be signing keys with our root CA.

### Generating Certificates

We will be generating two certificates, each representing a type of certificate:

- One certificate is for Tiller. You will want one of these _per tiller host_ that
  you run.
- One certificate is for the user. You will want one of these _per helm user_.

Since the commands to generate these are the same, we'll be creating both at the
same time. The names will indicate their target.

First, the Tiller key:

```console
$ openssl genrsa -out ./tiller.key.pem 4096
Generating RSA private key, 4096 bit long modulus
..........................................................................................................................................................................................................................................................................................................................++
............................................................................++
e is 65537 (0x10001)
Enter pass phrase for ./tiller.key.pem:
Verifying - Enter pass phrase for ./tiller.key.pem:
```

Next, generate the Helm client's key:

```console
$ openssl genrsa -out ./helm.key.pem 4096
Generating RSA private key, 4096 bit long modulus
.....++
......................................................................................................................................................................................++
e is 65537 (0x10001)
Enter pass phrase for ./helm.key.pem:
Verifying - Enter pass phrase for ./helm.key.pem:
```

Again, for production use you will generate one client certificate for each user.

Next we need to create certificates from these keys. For each certificate, this is
a two-step process of creating a CSR, and then creating the certificate.

```console
$ openssl req -key tiller.key.pem -new -sha256 -out tiller.csr.pem
Enter pass phrase for tiller.key.pem:
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:CO
Locality Name (eg, city) []:Boulder
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Tiller Server
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:tiller-server
Email Address []:

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
```

And we repeat this step for the Helm client certificate:

```console
$ openssl req -key helm.key.pem -new -sha256 -out helm.csr.pem
# Answer the questions with your client user's info
```

(In rare cases, we've had to add the `-nodes` flag when generating the request.)

Now we sign each of these CSRs with the CA certificate we created (adjust the days parameter to suit your requirements):

```console
$ openssl x509 -req -CA ca.cert.pem -CAkey ca.key.pem -CAcreateserial -in tiller.csr.pem -out tiller.cert.pem -days 365
Signature ok
subject=/C=US/ST=CO/L=Boulder/O=Tiller Server/CN=tiller-server
Getting CA Private Key
Enter pass phrase for ca.key.pem:
```

And again for the client certificate:

```console
$ openssl x509 -req -CA ca.cert.pem -CAkey ca.key.pem -CAcreateserial -in helm.csr.pem -out helm.cert.pem  -days 365
```

At this point, the important files for us are these:

```
# The CA. Make sure the key is kept secret.
ca.cert.pem
ca.key.pem
# The Helm client files
helm.cert.pem
helm.key.pem
# The Tiller server files.
tiller.cert.pem
tiller.key.pem
```

Now we're ready to move on to the next steps.

## Creating a Custom Tiller Installation

Helm includes full support for creating a deployment configured for SSL. By specifying
a few flags, the `helm init` command can create a new Tiller installation complete
with all of our SSL configuration.

To take a look at what this will generate, run this command:

```console
$ helm init --dry-run --debug --tiller-tls --tiller-tls-cert ./tiller.cert.pem --tiller-tls-key ./tiller.key.pem --tiller-tls-verify --tls-ca-cert ca.cert.pem
```

The output will show you a Deployment, a Secret, and a Service. Your SSL information
will be preloaded into the Secret, which the Deployment will mount to pods as they
start up.

If you want to customize the manifest, you can save that output to a file and then
use `kubectl create` to load it into your cluster.

> We strongly recommend enabling RBAC on your cluster and adding [service accounts](./rbac.md)
> with RBAC.

Otherwise, you can remove the `--dry-run` and `--debug` flags. We also recommend
putting Tiller in a non-system namespace (`--tiller-namespace=something`) and enable
a service account (`--service-account=somename`). But for this example we will stay
with the basics:

```console
$ helm init --tiller-tls --tiller-tls-cert ./tiller.cert.pem --tiller-tls-key ./tiller.key.pem --tiller-tls-verify --tls-ca-cert ca.cert.pem
```

In a minute or two it should be ready. We can check Tiller like this:

```console
$ kubectl -n kube-system get deployment
NAME            DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
... other stuff
tiller-deploy   1         1         1            1           2m
```

If there is a problem, you may want to use `kubectl get pods -n kube-system` to
find out what went wrong. With the SSL/TLS support, the most common problems all
have to do with improperly generated TLS certificates or accidentally swapping the
cert and the key.

At this point, you should get a _failure_ when you run basic Helm commands:

```console
$ helm ls
Error: transport is closing
```

This is because your Helm client does not have the correct certificate to authenticate
to Tiller.

## Configuring the Helm Client

The Tiller server is now running with TLS protection. It's time to configure the
Helm client to also perform TLS operations.

For a quick test, we can specify our configuration manually. We'll run a normal
Helm command (`helm ls`), but with SSL/TLS enabled.

```console
helm ls --tls --tls-ca-cert ca.cert.pem --tls-cert helm.cert.pem --tls-key helm.key.pem
```

This configuration sends our client-side certificate to establish identity, uses
the client key for encryption, and uses the CA certificate to validate the remote
Tiller's identity.

Typing a line that is cumbersome, though. The shortcut is to move the key,
cert, and CA into `$HELM_HOME`:

```console
$ cp ca.cert.pem $(helm home)/ca.pem
$ cp helm.cert.pem $(helm home)/cert.pem
$ cp helm.key.pem $(helm home)/key.pem
```

With this, you can simply run `helm ls --tls` to enable TLS.

### Troubleshooting

*Running a command, I get `Error: transport is closing`*

This is almost always due to a configuration error in which the client is missing
a certificate (`--tls-cert`) or the certificate is bad.

*I'm using a certificate, but get `Error: remote error: tls: bad certificate`*

This means that Tiller's CA cannot verify your certificate. In the examples above,
we used a single CA to generate both the client and server certificates. In these
examples, the CA has _signed_ the client's certificate. We then load that CA
up to Tiller. So when the client certificate is sent to the server, Tiller
checks the client certificate against the CA.

*If I use `--tls-verify` on the client, I get `Error: x509: certificate is valid for tiller-server, not localhost`*

If you plan to use `--tls-verify` on the client, you will need to make sure that
the host name that Helm connects to matches the host name on the certificate. In
some cases this is awkward, since Helm will connect over localhost, or the FQDN is
not available for public resolution.

*If I use `--tls-verify` on the client, I get `Error: x509: cannot validate certificate for 127.0.0.1 because it doesn't contain any IP SANs`*

By default, the Helm client connects to Tiller via tunnel (i.e. kube proxy) at 127.0.0.1. During the TLS handshake,
a target, usually provided as a hostname (e.g. example.com), is checked against the subject and subject alternative
names of the certificate (i.e. hostname verification). However, because of the tunnel, the target is an IP address.
Therefore, to validate the certificate, the IP address 127.0.0.1 must be listed as an IP subject alternative name
(IP SAN) in the Tiller certificate.

For example, to list 127.0.0.1 as an IP SAN when generating the Tiller certificate:

```console
$ echo subjectAltName=IP:127.0.0.1 > extfile.cnf
$ openssl x509 -req -CA ca.cert.pem -CAkey ca.key.pem -CAcreateserial -in tiller.csr.pem -out tiller.cert.pem -days 365 -extfile extfile.cnf
```

Alternatively, you can override the expected hostname of the tiller certificate using the `--tls-hostname` flag.

*If I use `--tls-verify` on the client, I get `Error: x509: certificate has expired or is not yet valid`*

Your helm certificate has expired, you need to sign a new certificate using your private key and the CA (and consider increasing the number of days)

If your tiller certificate has expired, you'll need to sign a new certificate, base64 encode it and update the Tiller Secret:
`kubectl edit secret tiller-secret`

## References

- https://github.com/denji/golang-tls  
- https://www.openssl.org/docs/
- https://jamielinux.com/docs/openssl-certificate-authority/sign-server-and-client-certificates.html
