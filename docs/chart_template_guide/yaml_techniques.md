---
title: "Appendix: YAML Techniques"
description: A closer look at the YAML specification and how it applies to Helm.
sidebar_position: 15
---

Most of this guide has been focused on writing the template language. Here,
we'll look at the YAML format. YAML has some useful features that we, as
template authors, can use to make our templates less error prone and easier to
read.

The [YAML specification](https://yaml.org/spec/1.2/spec.html) distinguishes
between two kinds of data types: *scalar* types, which represent individual
values such as *strings*, *numbers*, *booleans*, and *null*; and *collection*
types, which group values together as either *maps* (key–value pairs) or
*sequences* (ordered lists). The following sections cover each of these in
more depth.

## YAML Strings

Much of the data that we place in YAML documents are strings. YAML has more than
one way to represent a string. This section explains the ways and demonstrates
how to use some of them.

There are three "inline" ways of declaring a string:

```yaml
way1: bare words
way2: "double-quoted strings"
way3: 'single-quoted strings'
```

All inline styles must be on one line.

- Bare words are unquoted, and are not escaped. For this reason, you have to be
  careful what characters you use.
- Double-quoted strings can have specific characters escaped with `\`. For
  example `"\"Hello\", she said"`. You can escape line breaks with `\n`.
- Single-quoted strings are "literal" strings, and do not use the `\` to escape
  characters. The only escape sequence is `''`, which is decoded as a single
  `'`.

In addition to inline strings, you can declare multi-line strings:

```yaml
coffee: |
  Latte
  Cappuccino
  Espresso
```

The above will treat the value of `coffee` as a single string equivalent to
`Latte\nCappuccino\nEspresso\n`.

Note that the first line after the `|` must be correctly indented. So we could
break the example above by doing this:

```yaml
coffee: |
         Latte
  Cappuccino
  Espresso

```

Because `Latte` is incorrectly indented, we'd get an error like this:

```
Error parsing file: error converting YAML to JSON: yaml: line 7: did not find expected key
```

In templates, it is sometimes safer to put a fake "first line" of content in a
multi-line document just for protection from the above error:

```yaml
coffee: |
  # Commented first line
         Latte
  Cappuccino
  Espresso

```

Note that whatever that first line is, it will be preserved in the output of the
string. So if you are, for example, using this technique to inject a file's
contents into a ConfigMap, the comment should be of the type expected by
whatever is reading that entry.

### Controlling Spaces in Multi-line Strings

In the example above, we used `|` to indicate a multi-line string. But notice
that the content of our string was followed with a trailing `\n`. If we want the
YAML processor to strip off the trailing newline, we can add a `-` after the
`|`:

```yaml
coffee: |-
  Latte
  Cappuccino
  Espresso
```

Now the `coffee` value will be: `Latte\nCappuccino\nEspresso` (with no trailing
`\n`).

Other times, we might want all trailing whitespace to be preserved. We can do
this with the `|+` notation:

```yaml
coffee: |+
  Latte
  Cappuccino
  Espresso


another: value
```

Now the value of `coffee` will be `Latte\nCappuccino\nEspresso\n\n\n`.

Indentation inside of a text block is preserved, and results in the preservation
of line breaks, too:

```yaml
coffee: |-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

In the above case, `coffee` will be `Latte\n  12 oz\n  16
oz\nCappuccino\nEspresso`.

### Folded Multi-line Strings

Sometimes you want to represent a string in your YAML with multiple lines, but
want it to be treated as one long line when it is interpreted. This is called
"folding". To declare a folded block, use `>` instead of `|`:

```yaml
coffee: >
  Latte
  Cappuccino
  Espresso


```

The value of `coffee` above will be `Latte Cappuccino Espresso\n`. Note that all
but the last line feed will be converted to spaces. You can combine the
whitespace controls with the folded text marker, so `>-` will replace or trim
all newlines.

Note that in the folded syntax, indenting text will cause lines to be preserved.

```yaml
coffee: >-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

The above will produce `Latte\n  12 oz\n  16 oz\nCappuccino Espresso`. Note that
both the spacing and the newlines are still there.

### Generating Strings in Templates

So far, this section has covered static YAML strings. That is, YAML strings
that are copied from the template to the resulting YAML file verbatim.

Things get more complicated when templates generate YAML strings based on
[dynamic values](/chart_template_guide/values_files.mdx). These values could
contain YAML special characters (including line breaks and indentation), so the
following naive approach could break the YAML structure that we intend:

```yaml
data:
  drink: {{ .Values.favorite.drink }}
```

To address this problem, we can encode values as double-quoted YAML strings
using the [`quote`](/chart_template_guide/function_list.mdx#quote-and-squote)
function:

```yaml
data:
  drink: {{ .Values.favorite.drink | quote }}
```

The `quote` function both wraps the input value in quotes and escapes control
characters that have a special meaning within double-quoted YAML strings.
This means that we must **not** add our own quotes around the outputs of the
`quote` function.

This also means that constructing a YAML string from multiple values is
slightly more complicated. We can do so by concatenating the values (using
functions such as `print` or `printf`) and then piping the result to `quote`:

```yaml
data:
  endorsement: {{ print "The " .Release.Name " release loves " .Values.favorite.drink "!" | quote }}
  disclaimer: {{ printf "This endorsement is paid for by the %s industry." .Values.favorite.drink | quote }}
```

As the YAML spec says, double-quoted strings are "the only style capable of
expressing arbitrary strings". However, double-quoted strings can be hard to
read, in particular, when they are long and contain line breaks. In these
situations, we can use multi-line strings in block syntax, as described above.
When generating multi-line YAML strings from dynamic values, it is important
to get the indent right. For this, we can use the
[`nindent`](/chart_template_guide/function_list/#nindent) function in our
template:

```yaml
myLongText: |
  {{- .Values.stringWithLongText | nindent 2 }}
```

Note how we do the indentation above: `nindent 2` tells the template engine to
add a newline and indent every line in `stringWithLongText` with two spaces.
The `{{-` trims the whitespace to the left, and `nindent` re-adds the newline
and correct indentation.

As noted for static case, there is a caveat to this approach. If the first
non-blank line of the value contains leading white-space this breaks our
indent. The YAML parser will report this as an error and Helm will abort the
install or update. When this happens we can adjust our template and generate
the YAML string for this value using the `quote` function instead.

Another catch is that the `nindent` value must be greater than the indent of
the surrounding YAML. In the above example, `myLongText` has zero indent, so we
use `nindent 2`. If `myLongText` had an indent of 4, we'd use `nindent 6`
instead. It is customary to increase indent in steps of `2`. When changing the
indent of surrounding YAML, take care to adjust relevant `nindent` values
accordingly!

### Importing Files into Strings in Templates

When writing templates, you may find yourself wanting to inject the contents of
a file into the template. As we saw in previous chapters, there are two ways of
doing this:

- Use `{{ .Files.Get "FILENAME" }}` to get the contents of a file in the chart.
- Use `{{ include "TEMPLATE" . }}` to render a template and then place its
  contents into the chart.

When inserting files into YAML strings, it's good to understand the encoding
rules above. We can use either the `quote` approach or the `nindent` approach:

```yaml
myfile:
  {{ .Files.Get "myfile.txt" | quote }}
mytemplate: |
  {{- include "mytemplate.txt" . | nindent 2 }}
```

Obviously this also works the other way around, using `.Files.Get` with
`nindent` and using `include` with `quote`.

## Other YAML Scalars

Strings are a common type of YAML scalars, but not the only one. Other scalar
types include *integers*, *floats*, *booleans*, and *null*. In Helm's dialect
of YAML, the scalar data type of a value is determined by a complex set of
rules, including the Kubernetes schema for resource definitions. But when
inferring types, the following rules tend to hold true.

If an integer or float is an unquoted bare word, it is typically treated as a
numeric type:

```yaml
count: 1
size: 2.34
```

But if they are quoted, they are treated as strings:

```yaml
count: "1" # <-- string, not int
size: '2.34' # <-- string, not float
```

The same is true of booleans:

```yaml
isGood: true   # bool
answer: "true" # string
```

The word for an empty value is `null` (not `nil`).

Note that `port: "80"` is valid YAML, and will pass through both the template
engine and the YAML parser, but will fail if Kubernetes expects `port` to be an
integer.

In some cases, you can force a particular type inference using YAML node tags:

```yaml
age: !!str 21
pi: !!float "3.14"
port: !!int "80"
enable: !!bool "false"
extras: !!null "null"
```

In the above, `!!str` tells the parser that `age` is a string, even though its
value looks like an integer. And the tags for `pi`, `port`, `enable`, and
`extras` tell the parser that these are float, integer, boolean, and null
values respectively, even though they are quoted.

### Generating Scalars in Templates

So far, we have covered static YAML scalars. That is, YAML scalars
that are copied from the template to the resulting YAML file verbatim.

In an ideal case, generating non-string YAML scalars based on
[dynamic values](/chart_template_guide/values_files.mdx) does not require
special attention. Templates serialize
[Go Data Types](/chart_template_guide/data_types.mdx) in a manner that is
compatible with YAML. A string value that holds the representation of a number,
boolean, or null can also be emitted into a YAML file verbatim. No extra
quoting or escaping is needed in any of these situations.

However, there is a catch: as Helm template authors, we can never be certain
about the dynamic values that users will pass to our Helm chart. Therefore, it
is preferable to add explicit type constraints whenever emitting dynamic values
as non-string scalars. As seen in the previous subsection, we can use YAML
node tags to achieve this:

```yaml
pi: !!float {{ .Values.constants.pi | quote }}
port: !!int {{ .Values.service.port | quote }}
enable: !!bool {{ .Values.service.enable | quote }}
```

In the above, the Go template code treats all scalars as it would treat
strings: it wraps them in double-quotes and escapes special characters. Then,
the YAML node tags tell the YAML parser to convert this string scalar to the
desired YAML type (e.g. a floating point number, an integer number, or a
boolean).

If the string contents do not match the expected YAML scalar type, Helm's YAML
parser will report an error even before Helm passes the YAML data to
Kubernetes. This fail-fast approach can make debugging much easier when users
pass an unexpected value to the Helm chart. E.g. when a dynamic value is not
the expected integer, but a string containing YAML special characters (such as
quotation marks, colons, brackets, curly braces, line-breaks, etc.) this can
prevent debugging nightmares.

## YAML Collections

YAML collection types can be used for composing data from other YAML types,
be it scalar types or other collections. There are two types of collections:
*maps* (key–value pairs) and *sequences* (ordered lists):

```yaml
map:
  one: 1
  two: 2
  three: 3

sequence:
  - one
  - two
  - three
```

### Generating Collections in Templates

Now let's look at how we can generate YAML collection types based on dynamic
values. We can do so by combining
[`toYaml`](/chart_template_guide/function_list/#toyaml-toyamlpretty) function
and the [`nindent`](/chart_template_guide/function_list/#nindent) function:

```yaml
map:
  {{- toYaml .Values.myMap | nindent 2 }}

sequence:
  {{- toYaml .Values.mySequence | nindent 2 }}
```

Note how we do the indentation above: `nindent 2` tells the template engine to
add a newline and indent every line of the serialized collection with two
spaces. The `{{-` trims the whitespace to the left, and `nindent` re-adds the
newline and correct indentation.

Note that in the above, the template code is identical for both the map and the
sequence. The `toYaml` method determines the YAML type to generate by the
[Go Data Type](/chart_template_guide/data_types.mdx) of the dynamic value.

If the dynamic value originates from a `values.yaml` file, the original YAML
type of the value will be preserved. This also works reliably for nested YAML
collections and YAML scalars, too. Therefore, the above is a good method for
copying larger chunks of data from dynamic values to the YAML file generated by
the template.

Incidentally, the above `toYaml`/`nindent` approach works not just for YAML
collections, but also for YAML scalars (including strings). So you can safely
use it for dynamic values of any YAML type. This is particularly useful in
situations where template authors do not want to restrict the YAML type of a
value that users will ultimately feed to the Helm chart. That said, dedicated
YAML encoding techniques for scalars (as introduced further above) are often
more concise and more readable.

As always when using `nindent` to generate YAML, it is important to get the
`nindent` value right. The `nindent` must be greater than the indent of
surrounding YAML. When changing the indent of surrounding YAML, take care to
adjust relevant `nindent` values accordingly!

## Embedding Multiple Documents in One File

It is possible to place more than one YAML document into a single file. This is
done by prefixing a new document with `---` and ending the document with
`...`

```yaml

---
document: 1
...
---
document: 2
...
```

In many cases, either the `---` or the `...` may be omitted.

Some files in Helm cannot contain more than one doc. If, for example, more than
one document is provided inside of a `values.yaml` file, only the first will be
used.

Template files, however, may have more than one document. When this happens, the
file (and all of its documents) is treated as one object during template
rendering. But then the resulting YAML is split into multiple documents before
it is fed to Kubernetes.

We recommend only using multiple documents per file when it is absolutely
necessary. Having multiple documents in a file can be difficult to debug.

## YAML is a Superset of JSON

Because YAML is a superset of JSON, any valid JSON document _should_ be valid
YAML.

```json
{
  "coffee": "yes, please",
  "coffees": [
    "Latte", "Cappuccino", "Espresso"
  ]
}
```

The above is another way of representing this:

```yaml
coffee: yes, please
coffees:
- Latte
- Cappuccino
- Espresso
```

And the two can be mixed (with care):

```yaml
coffee: "yes, please"
coffees: [ "Latte", "Cappuccino", "Espresso" ]
```

All three of these should parse into the same internal representation.

While this means that files such as `values.yaml` may contain JSON data, Helm
does not treat the file extension `.json` as a valid suffix.

## YAML Anchors

The YAML spec provides a way to store a reference to a value, and later refer to
that value by reference. YAML refers to this as "anchoring":

```yaml
coffee: "yes, please"
favorite: &favoriteCoffee "Cappuccino"
coffees:
  - Latte
  - *favoriteCoffee
  - Espresso
```

In the above, `&favoriteCoffee` sets a reference to `Cappuccino`. Later, that
reference is used as `*favoriteCoffee`. So `coffees` becomes `Latte, Cappuccino,
Espresso`.

While there are a few cases where anchors are useful, there is one aspect of
them that can cause subtle bugs: The first time the YAML is consumed, the
reference is expanded and then discarded.

So if we were to decode and then re-encode the example above, the resulting YAML
would be:

```yaml
coffee: yes, please
favorite: Cappuccino
coffees:
- Latte
- Cappuccino
- Espresso
```

Because Helm and Kubernetes often read, modify, and then rewrite YAML files, the
anchors will be lost.

## Security Considerations

The YAML techniques presented in this page help Helm chart authors in writing
reliable YAML templates. By applying appropriate encoding techniques when
generating YAML based on dynamic values, template authors can ensure that the
resulting YAML is correct and has the desired structure regardless of what
values users pass to the Helm chart. This ensures functional correctness in all
corner-cases and prevents errors that might be hard to debug.

However, comprehensive YAML encoding also prevents vulnerabilities that YAML
templates might otherwise introduce.

### Preventing YAML Injection

An [injection flaw](https://owasp.org/www-community/Injection_Flaws) is a
vulnerability that allows attackers to inject malicious data or code into a
system. Thus, a YAML injection vulnerability allows attackers to inject
malicious data into the YAML file that a template generates.

YAML code is hardly malicious in itself, but in the context of Helm charts,
YAML is used to control Kubernetes resources. Therefore, attackers could
exploit a YAML injection vulnerability to deploy malicious Kubernetes resources
into your cluster. For example, attackers could:

* Create pods based on attacker-controlled container images.
* Inject secrets into such containers and leak them over the network.
* Run attacker-controlled commands in existing containers.
* Create new Service Accounts, (Cluster)Roles, and (Cluster)RoleBindings to escalate their privileges.

In order to run a YAML injection attack, an attacker would first need to pass
their own [values](/chart_template_guide/values_files) to your Helm chart. This
seems unlikely, and in fact it may never happen when you're using your own Helm
charts. Even when consuming Helm charts from other authors, Helm users will
often have full control of the values that they use.

However, in some *Infrastructure-as-Code* scenarios, users will not pass values
to a Helm chart manually through CLI arguments or value files. Instead, users
may use some orchestration tool (e.g. a CI/CD pipeline) to install Helm charts
and pass values to them. In some scenarios, such orchestration tools may draw
values from additional data sources that might contain all sorts of data. And
this is where things can get potentially dangerous.

Here's the good news though: when following the YAML techniques that this page
describes, you're already preventing YAML injection vulnerabilities. It takes
nothing more than applying the described indenting, quoting, and encoding
techniques in your template. When writing your YAML templates in this manner
you and all consumers of your Helm chart are safe from YAML injection.

### Preventing Dangerous YAML through Validation

In some situations, additional validation of the dynamic values that a YAML
template processes may be desirable. Usually, the concern here is not the
structure of the resulting YAML, but application specific constraints on the
resources that the Helm chart manages.

For example, a config map may hold individual fields that must match a certain
format, regardless of how their value is encoded in YAML. This could be the
format of a domain name, an IP address, an email-address, or a URL. In the
latter case, additional constraints regarding the URL scheme may be desirable.

Helm charts offer two complementary mechanisms that help impose constraints on
dynamic values, *Schema Files* and *Validation Logic in Templates*.

#### Schema Files

Helm's [Schema Files](/topics/charts#schema-files) allow chart authors to
validate values against a [JSON Schema](https://json-schema.org/)
(`values.schema.json`). If the user of a Helm chart tries to pass dynamic values
to the chart that violate the JSON Schema, Helm reports an error.

This validation approach is input-centric, as the JSON Schema constrains all
values as passed to the Helm chart. This is useful for values that appear
inside multiple YAML templates of a Helm chart.

JSON Schema is quite powerful, and can be used to impose validation constraints
on both YAML collections and YAML scalars. For instance, JSON Schema can
validate strings against regular expressions and validate numbers against
ranges. However, more complex validation logic may be hard or impossible to
express in JSON Schema.

#### Validation Logic in Templates

Helm chart templates are based on
[Go Templates](https://pkg.go.dev/text/template), which is a powerful template
language that can execute arbitrary program logic. Therefore, complex
validation can be expressed through conditional logic in the YAML template
itself. If validation fails, your template can call the
[fail](/chart_template_guide/function_list#fail) function, which tells Helm to
abort processing the chart with an error.

For instance, the following YAML template snippet can be used to set a virtual
server's domain name only if the given value matches a DNS domain:

```yaml
{{ if not ( regexMatch "^([-a-z0-9]+[.])*([-a-z0-9]+)$" .Values.server.domain ) }}
  {{ print "Server domain \"" .Values.server.domain "\" does not look like a valid DNS domain." | fail }}
{{ end }}
server:
  port: !!int {{ .Values.server.port | quote }}
  domain: {{ .Values.server.domain | quote }}
```

(The above is an example only, as the regular expression does not enforce all
formal requirements for a valid DNS domain.)

This validation approach is output-centric, as it applies the validation logic
close to where the YAML output is generated. This is useful for values that are
dynamically derived from other values in the template itself. That said, overly
complex processing logic should generally be avoided in templates.

Note that the above example still encodes the `domain` value using the `quote`
function. This is not strictly necessary here, because validation blocks all
values that would require YAML encoding and quoting. However, the use of
`quote` makes the template more robust with respect to future changes. It is
also cleaner conceptually, since ensuring a valid domain and producing correct
YAML are two separate concerns.