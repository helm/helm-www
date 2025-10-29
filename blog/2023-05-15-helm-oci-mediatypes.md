---
title: "The Helm OCI MediaTypes"
slug: "helm-oci-mediatypes"
authors: ["andrewblock"]
date: "2023-05-15"
---

Helm introduced full support for storing charts within OCI registries as a distribution method beginning in version 3.8, and while this feature has been available for some time now, there is more underneath the hood than one may realize to make this capability all possible. A number of concepts, working in unison, make it possible to store content aside from traditional container images within OCI registries. This article will explore one of these important concepts, Media Types, their purpose, and how Helm’s own set of Media Types make it possible to extend the storage of charts beyond standard chart repositories to OCI registries.<!-- truncate -->

## OCI Artifacts

Even though the majority of content stored within OCI registries are container images, additional content types can also be stored. The [Open Container Initiative (OCI)](https://opencontainers.org) defines these other assets as “Artifacts” and the ability to make use of OCI registries to store arbitrary content types has fundamentally changed how content is distributed. Instead of requiring a separate repository management tool for each type of asset, the very same registry that is already present to house container images can be reused without requiring additional software or infrastructure resources. This not only simplifies operational concerns from a hosting perspective, but provides a more uniform method of distributing content.

Helm has taken full advantage of the benefits of storing charts as OCI artifacts as it not only eliminates the complexity of managing a traditional chart repository, but simplifies the amount of resources that need to be maintained. When using a chart repository as a distribution and hosting solution, multiple assets need to be maintained:

* The packaged chart
* An optional provenance file
* A repository index file

Producing a Helm chart that is stored as an OCI artifact results in an asset with all of the necessary content packaged as a single atomic unit. The structure of the OCI artifact consists of the following three (3) key resources:

* An OCI Image Config containing the contents of the Chart.yaml file
* The packaged chart within an Image Layer
* The provenance file (when included) as an Image Layer

The composition of an OCI Helm Chart and the relationship of each of the aforementioned resources can be seen by inspecting the associated OCI Image Manifest. An example is displayed below:

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    },
    {
      "mediaType": "application/vnd.cncf.helm.chart.provenance.v1.prov",
      "digest": "sha256:3e207b409db364b595ba862cdc12be96dcdad8e36c59a03b7b3b61c946a5741a",
      "size": 643
    }
  ]
}
```

This cross-section illustrates not only the components of an OCI based Helm Chart, but OCI based content in general. Each resource, whether it be a layer or a Config Manifest contain the same sets of properties within the Image Manifest.

* Size – Content size
* Digest – Content addressable reference signifying the algorithm and hash used
* Media Type – Media Type of the referenced content

The Media Type property is arguably the most significant property given the purpose of this discussion. Now that we see where they are referenced within OCI Artifacts, let’s review Media Types in further detail.

## Media Types and Their Significance

Media Types, previously known as MIME (Multipurpose Internet Mail Extensions) Types have been around since the early days of the World Wide Web era as they identify file formats and content transmitted through the internet. Their structure consists of two concise sections separated by a slash (/): types and subtypes. Only a limited number of types are defined (10 in total) as they represent a broad use of the type itself. Subtypes are much more diverse and they are organized into a tree structure to enable a hierarchy of related types.

A common Media Type that anyone who has experience with RESTful based communication is familiar with is `application/json` as it is used to indicate that the content being transmitted is in JSON format. By indicating a Media Type whenever content is being transferred, the format and its representation is understood by both producers and consumers.

The OCI Image Specification contains several Media Types that represent the various structural elements of an image. These include:

* `application/vnd.oci.image.index.v1+json` - Index Image
* `application/vnd.oci.image.manifest.v1+json` - Image Manifest
* `application/vnd.oci.image.layer.v1.tar+gzip` - gzip compressed Layer

These provide a concrete example to aid in understanding the structural composition of a Media Type. Each of these fall within the `application` type as they are utilized by specific applications. The subtree here can be broken down into the following components:

* `vnd` - The vendor tree which are associated with specific products
* `oci` - The organization or company responsible
* `image` - A short name for the type
* `index/manifest/layer` - an optional subcomponent of the type
* `v1` - enables the versioning of the schema
* `json/tar+gzip` - Optional format signifier 

A more detailed description of the composition of a Media Type can be found [here](https://github.com/opencontainers/artifacts/blob/main/artifact-authors.md#defining-a-unique-artifact-type).

## Helm Media Types

The Helm community has worked with the IANA to register three new Media Types representing each of the components comprising an OCI based Helm Chart.

* [application/vnd.cncf.helm.config.v1+json](https://www.iana.org/assignments/media-types/application/vnd.cncf.helm.config.v1+json)
* [application/vnd.cncf.helm.chart.content.v1.tar+gzip](https://www.iana.org/assignments/media-types/application/vnd.cncf.helm.chart.content.v1.tar+gzip)
* [application/vnd.cncf.helm.chart.provenance.v1.prov](https://www.iana.org/assignments/media-types/application/vnd.cncf.helm.chart.provenance.v1.prov)

Similar to the OCI Media Types shown in the prior section, the Helm Media Types are also located within the vendor tree and use the abbreviation for the Cloud Native Computing Foundation (cncf) as the responsible organization. The remainder of the Media Type subtree is fairly self explanatory as it provides additional distinction to the type of content itself and the format. Anyone inspecting a resource within an OCI registry representing a Helm chart would be able to easily identify it as a Helm chart and understand how to interact with the content.

For those interested in learning more about the Helm Media Types, including the low level technical details, can view the registration details within IANA which provides a wealth of information including the intended use and lower level data specification.

Helm is certainly not alone in the use of OCI artifacts as a distribution method. Other prominent technologies, including Web Assembly (WASM) and Software Bill of Materials (SBOM’s), also leverage OCI artifacts. It is safe to say that we will see the continued adoption of OCI artifacts as a method of storing content by more and more projects and technologies moving forward.

## The Future for Helm’s OCI Media Types

As anyone who has worked in software development, especially with regards to large, complex projects, can relate to the amount of time it takes for features to be implemented. Work surrounding OCI integration was originally introduced back in Helm version 3.5 and how OCI artifacts in general are stored and managed have evolved since that time. The OCI version 1.1 image specification provides not only additional structure, but guidance on how to manage OCI artifacts. As this specification is not only finalized, but adopted and implemented by registry providers, we will continue to see an increased adoption of the technology. The Helm project and community will continue to evolve with the rest of the industry so that Chart producers and consumers have not only the best experience possible, but can best leverage the available technology. 
