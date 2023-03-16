## About PanDrugs
PanDrugs is a computational methodology implemented as a web tool to guide the selection of personalised treatments for cancer patients. 

The first version of PanDrugs, which was published in 2018, prioritized anticancer drug treatments according to gene lists or somatic variants. 

PanDrugs 2 includes novelties such as:

- **A major update of PanDrugsdb:** With up-to-date drug-gene associations retrieved from several sources. <!-- link to sources -->

- **New inputs:** Copy Number Variants (CNVs), expression data and germline variants. 

- **New drug-gene association:** In addition to direct targets, biomarkers and pathway members, PanDrugs 2 also considers genetic dependencies for ranking the most suitable therapeutic options.

- **An Adverse Drug Reaction (ADR) aware drug prioritization:** Whenever germline variants are present in the input Variant Calling File (VCF), PanDrugs can label the ranked drugs with their Clinical Pharmacogenetics Implementation Consortium (CPIC) recommendations retrieved via PharmCAT.

- **A multi-omics prioritization mode:** The user can rank PanDrugsdb treatments based on up to 3 different inputs: somatic (and optionally, germline) variants, CNVs and expression data.

- **A patient report:** PanDrugs 2 generates intuitive reports to support clinical decision-making.

PanDrugs has been designed, created and is maintained by the CNIO Bioinformatics Unit and the SING Group:

### CNIO Bioinformatics Unit

The Bioinformatics Unit of the Spanish National Cancer Research Centre (BU-CNIO) has a double mission: to support other CNIO groups and to conduct research in bioinformatics. This research 
focuses on developing novel computational methods for integrating cancer genomics data with clinical and pathological information. Our final goal is to translate this knowledge into effective and personalised cancer treatment.

<div style="text-align: left;">
<a href=https://bioinformatics.cnio.es target="_blank"><img src="bu-cnio-logo.png" alt="BU-CNIO" height="3%" width="3%"/></a>
<a href="https://www.cnio.es" target="_blank"><img src="cnio-logo.svg" alt="CNIO" height="6%" width="6%"></a>
<a href="https://inb-elixir.es" target="_blank"><img src="inb-elixir-logo.png" alt="INB-ELIXIR" height="10%" width="10%"></a>
</div>

### SING Group

The SING Group (Next-Generation Computer Systems Group, University of Vigo, Spain) has more than 15 years of experience developing bioinformatics and biomedicine applications in collaboration with relevant research groups, taking advantage of cutting-edge techniques and methods in the fields of Machine Learning, Distributed Computing and Software Engineering.

<div style="text-align: left;">
<a href=http://www.sing-group.org target="_blank"><img src="sing-logo.png" alt="SING" height="5%" width="5%"/></a>
<a href=https://www.uvigo.gal" target="_blank"><img src="u-vigo-logo.svg" alt="University of Vigo" height="7%" width="7%"></a>
</div>