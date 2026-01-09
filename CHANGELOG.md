# Changelog
All notable changes to this project will be documented in this file.

<a name="v5.0.0"></a>
## [v5.0.0](https://github.com/rubensworks/rdf-parse.js/compare/v4.0.0...v5.0.0) - 2026-01-09

### BREAKING CHANGE
* [Update to Comunica v5 with RDF 1.2 support](https://github.com/rubensworks/rdf-parse.js/commit/d8fcf21445223bd0e7357a8a61f41a80571f4775)
    This adds RDF 1.2 support, and removes RDF-star support.
    The minimum Node.js version is now 20.

<a name="v4.0.0"></a>
## [v4.0.0](https://github.com/rubensworks/rdf-parse.js/compare/v3.0.0...v4.0.0) - 2024-10-15

### BREAKING CHANGES
* [Bump to Comunica v4 prerelease](https://github.com/rubensworks/rdf-parse.js/commit/a640da2ad3a1929b977ccfb759a4d6ad8d9d0acd)
    * Besides performance improvements, this increases the minimum requires Node.js version to 18.

<a name="v3.0.0"></a>
## [v3.0.0](https://github.com/rubensworks/rdf-parse.js/compare/v2.3.3...v3.0.0) - 2024-07-04

### BREAKING CHANGES
* [Replace default exports with named exports for better ESM support (#61)](https://github.com/rubensworks/rdf-parse.js/commit/80eabdce290d03d73819a4625ed169244c25ff03)
  * Update your imports to `import { rdfParser } from "rdf-parse";`

<a name="v2.3.3"></a>
## [v2.3.3](https://github.com/rubensworks/rdf-parse.js/compare/v2.3.2...v2.3.3) - 2024-02-06

### Fixed
* [Fix wrong type in export in index, Closes #58](https://github.com/rubensworks/rdf-parse.js/commit/82e1d135131069981c6431558e292c46b3b11371)

<a name="v2.3.2"></a>
## [v2.3.2](https://github.com/rubensworks/rdf-parse.js/compare/v2.3.1...v2.3.2) - 2023-03-30

### Fixed
* [Expose all supported mappings](https://github.com/rubensworks/rdf-parse.js/commit/6f0df2bc748b9d8cb9174bf7561579ff800ee4ca)

<a name="v2.3.1"></a>
## [v2.3.1](https://github.com/rubensworks/rdf-parse.js/compare/v2.3.0...v2.3.1) - 2023-02-27

### Fixed
* [Use readable-stream instead of Node streams](https://github.com/rubensworks/rdf-parse.js/commit/74bd7afc4acb2e3cb9ccbc3e644147f4da02a562)

<a name="v2.3.0"></a>
## [v2.3.0](https://github.com/rubensworks/rdf-parse.js/compare/v2.2.0...v2.3.0) - 2023-02-01

### Added
* [Expose `CONTENT_MAPPINGS` and `getContentTypeFromExtension` (#50)](https://github.com/rubensworks/rdf-parse.js/commit/608c540e795ff8884e582ff8371d49d936f5c3f9)

<a name="v2.2.0"></a>
## [v2.2.0](https://github.com/rubensworks/rdf-parse.js/compare/v2.1.1...v2.2.0) - 2023-01-31

### Added
* [Add shaclc support](https://github.com/rubensworks/rdf-parse.js/commit/ebcab6d03e168ecdfb311d4626d37da86dc5b380)

<a name="v2.1.1"></a>
## [v2.1.1](https://github.com/rubensworks/rdf-parse.js/compare/v2.1.0...v2.1.1) - 2022-11-09

### Fixed
* [Include source map files in packed files](https://github.com/rubensworks/rdf-parse.js/commit/21d1999143164edb7644a33c0509cee4ae742b00)

<a name="v2.1.0"></a>
## [v2.1.0](https://github.com/rubensworks/rdf-parse.js/compare/v1.9.1...v2.1.0) - 2022-07-08

### Added
* [Emit prefix and context events when parsing, Closes #22](https://github.com/rubensworks/rdf-parse.js/commit/e971663f1fee53237fd279541dfefb2a2b844a7a)

<a name="v2.0.0"></a>
## [v2.0.0](https://github.com/rubensworks/rdf-parse.js/compare/v1.9.1...v2.0.0) - 2022-03-02

Even though this is a major update, there are no breaking changes for most end-users.
Only the internal configuration files have breaking changes, which may require manual attention for users that reconfigure this package via config files.

### Changed
* [Update to Comunica 2](https://github.com/rubensworks/rdf-parse.js/commit/9e914d6ad372f2d94e2d0530828408497f6023c0)

<a name="v1.9.1"></a>
## [v1.9.1](https://github.com/rubensworks/rdf-parse.js/compare/v1.8.1...v1.9.1) - 2021-08-30

### Fixed
* [Fix @comunica/actor-rdf-parse-jsonld not being bumped to latest](https://github.com/rubensworks/rdf-parse.js/commit/54dcf82fcab34b6efe42feb5a7f27e26249cd697)

<a name="v1.9.0"></a>
## [v1.9.0](https://github.com/rubensworks/rdf-parse.js/compare/v1.8.1...v1.9.0) - 2021-08-30

### Changed
* [Migrate to @rdfjs/types](https://github.com/rubensworks/rdf-parse.js/commit/d587837df2b4c7063c1a67fd744523542e41da4c)

<a name="v1.8.1"></a>
## [v1.8.1](https://github.com/rubensworks/rdf-parse.js/compare/v1.8.0...v1.8.1) - 2021-06-14

### Changed
* [Bump Comunica to 1.21.2](https://github.com/rubensworks/rdf-parse.js/commit/1685a074835a8b336cc3d79b0cf6446528bcc848)

<a name="v1.8.0"></a>
## [v1.8.0](https://github.com/rubensworks/rdf-parse.js/compare/v1.7.0...v1.8.0) - 2021-04-27

### Changed
* [Update to Comunica 1.21](https://github.com/rubensworks/rdf-parse.js/commit/b9d0f4affd63fa23c399d7d79243381b3b9a32c7)
* [Use more compact Components.js declaration in package.json](https://github.com/rubensworks/rdf-parse.js/commit/43780d421c462119a9b80861d25dfe4bcf9537cd)

<a name="v1.7.0"></a>
## [v1.7.0](https://github.com/rubensworks/rdf-parse.js/compare/v1.6.1...v1.7.0) - 2021-01-15

### Changed
* [Update to Comunica 1.19](https://github.com/rubensworks/rdf-parse.js/commit/f4bd95540af1c02304b0d6d230b850ce72152c91)

<a name="v1.6.1"></a>
## [v1.6.1](https://github.com/rubensworks/rdf-parse.js/compare/v1.6.0...v1.6.1) - 2020-11-12

### Fixed
* [Fix backpressuring not being maintained](https://github.com/rubensworks/rdf-parse.js/commit/269c757935c54b388e1bde076dc29c2afc2e8e7b)

<a name="v1.6.0"></a>
## [v1.6.0](https://github.com/rubensworks/rdf-parse.js/compare/v1.5.0...v1.6.0) - 2020-11-03

### Added
* [Add Microdata to RDF in HTML parser](https://github.com/rubensworks/rdf-parse.js/commit/756ffa32a23b190381809c685d7837f8e969ec5e)

### Changed
* [Update to latest RDF/JS typings](https://github.com/rubensworks/rdf-parse.js/commit/a6724f2b2c5f23dea37be6b965bc07049f9b1b1e)
* [Add stricter checks for contentType and path](https://github.com/rubensworks/rdf-parse.js/commit/641c4f7ee475a47a8510694e974cff5143a88442)

<a name="v1.5.0"></a>
## [v1.5.0](https://github.com/rubensworks/rdf-parse.js/compare/v1.4.0...v1.5.0) - 2020-08-31

### Changed
* [Mark parsed stream as readable](https://github.com/rubensworks/rdf-parse.js/commit/7cb0dc71f95a6d17353a0c493a75774df8685e29)
* [Expose parser typings](https://github.com/rubensworks/rdf-parse.js/commit/d0124e764e0b6c85bbb023f2622cea14fdd748b8)

<a name="v1.4.0"></a>
## [v1.4.0](https://github.com/rubensworks/rdf-parse.js/compare/v1.3.1...v1.4.0) - 2020-08-24

### Changed
* [Update to Comunica 1.16](https://github.com/rubensworks/rdf-parse.js/commit/162c234a925c57916610731efdbca0742fc5c60c)

<a name="v1.3.1"></a>
## [v1.3.1](https://github.com/rubensworks/rdf-parse.js/compare/v1.3.0...v1.3.1) - 2020-06-19

### Changed
* [Update to Comunica 1.13](https://github.com/rubensworks/rdf-parse.js/commit/924ae4d36c3cccb6145a8c326782f803583a744b)

<a name="v1.3.0"></a>
## [v1.3.0](https://github.com/rubensworks/rdf-parse.js/compare/v1.2.2...v1.3.0) - 2020-04-03

### Changed
* [Update dependencies related to JSON-LD 1.1](https://github.com/rubensworks/rdf-parse.js/commit/cb44d464ef7b32521d8008feaf2830ee5c307421)

<a name="v1.2.2"></a>
## [v1.2.2](https://github.com/rubensworks/rdf-parse.js/compare/v1.2.1...v1.2.2) - 2020-03-09

### Fixed
* [Add missing bus-init actor, Closes #13](https://github.com/rubensworks/rdf-parse.js/commit/df5d976fda03e60051b33bf8d66cec60207e0743)

<a name="v1.2.1"></a>
## [v1.2.1](https://github.com/rubensworks/rdf-parse.js/compare/v1.1.2...v1.2.1) - 2019-10-21

### Fixed
* [Avoid circular importing of parser](https://github.com/rubensworks/rdf-parse.js/commit/fa0eed536f651f2a094a26130ac9fffdc7351cb6)

<a name="v1.2.0"></a>
## [v1.2.0](https://github.com/rubensworks/rdf-parse.js/compare/v1.1.2...v1.2.0) - 2019-10-17

### Changed
* [Tweak RDF media type priorities to Comunica 1.9.3, Closes #8](https://github.com/rubensworks/rdf-parse.js/commit/25f245ad67ecba1777e4702a643b7b9506b00649)

<a name="v1.1.2"></a>
## [v1.1.2](https://github.com/rubensworks/rdf-parse.js/compare/v1.1.1...v1.1.2) - 2019-09-27

### Changed
* [Update to Comunica 1.9.2, Closes #6](https://github.com/rubensworks/rdf-parse.js/commit/4921877f4ce53be257966bec969cc5f315ef5172)

<a name="v1.1.1"></a>
## [v1.1.1](https://github.com/rubensworks/rdf-parse.js/compare/v1.1.0...v1.1.1) - 2019-09-17

### Fixed
* [Add Components.js files to published package](https://github.com/rubensworks/rdf-parse.js/commit/1741ba9b488ce2fcc3e298a5d27def0e2734b440)

<a name="v1.1.0"></a>
## [v1.1.0](https://github.com/rubensworks/rdf-parse.js/compare/v1.0.0...v1.1.0) - 2019-07-29

### Added
* [Plug in Comunica's new XML/HTML parsers](https://github.com/rubensworks/rdf-parse.js/commit/96d7c9459719154db1352f3557816ba0cd5bb37c)

### Changed
* [Update to new default media type priorities](https://github.com/rubensworks/rdf-parse.js/commit/f326ac8a2f5df4cb5f2a290221c85e3659fbeda0)

<a name="v1.0.0"></a>
## [v1.0.0] - 2019-04-03

Initial release
