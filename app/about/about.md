## About PanDrugs<a name="pandrugs-sources"></a>
PanDrugs is a computational methodology implemented as a web tool to guide the selection of personalized treatments for cancer patients. 

The first version of PanDrugs, which was published in 2018, prioritized anticancer drug treatments according to gene lists or somatic variants.

PanDrugs2 includes novelties such as:

- **A major update of PanDrugsdb:** With up-to-date drug-gene associations retrieved from several [sources](#!/sources/pandrugs-sources).

- **New inputs:** copy number variants (CNVs), expression data and germline variants. 

- **New drug-gene association type:** In addition to direct targets, biomarkers and pathway members, PanDrugs2 also considers genetic dependencies for ranking the most suitable therapeutic options.

- **An Adverse Drug Reaction (ADR) aware drug prioritization:** Whenever germline variants are present in the input Variant Calling File (VCF), PanDrugs can label the ranked drugs with their [Clinical Pharmacogenetics Implementation Consortium (CPIC)](https://cpicpgx.org) guidelines retrieved via [PharmCAT](https://pharmcat.org).

- **A multi-omics prioritization mode:** The user can rank PanDrugsdb treatments based on up to 3 different inputs: somatic (and optionally, germline) variants, CNVs and expression data.

- **A patient report:** PanDrugs2 generates intuitive reports to support clinical decision-making.

PanDrugs has been designed, created and is maintained by the CNIO Bioinformatics Unit and the SING Group:

## CNIO Bioinformatics Unit

The Bioinformatics Unit of the Spanish National Cancer Research Centre (BU-CNIO) has a double mission: to support other CNIO groups and to conduct research in bioinformatics. This research 
focuses on developing novel computational methods for integrating cancer genomics data with clinical and pathological information. Our final goal is to translate this knowledge into effective and personalised cancer treatment.

<!--
[![BU-CNIO](bu-cnio-logo.png)](https://bioinformatics.cnio.es)  [![CNIO](cnio-logo.png)](https://www.cnio.es)     [![INB-ELIXIR](inb-elixir-logo.png)](https://inb-elixir.es)
-->

## SING Group

The SING Group (Next-Generation Computer Systems Group, University of Vigo, Spain) has more than 15 years of experience developing bioinformatics and biomedicine applications in collaboration with relevant research groups, taking advantage of cutting-edge techniques and methods in the fields of Machine Learning, Distributed Computing and Software Engineering.

<!--
[![SING](sing-logo.png)](http://www.sing-group.org) [![University of Vigo](u-vigo-logo.png)](https://www.uvigo.gal)
-->