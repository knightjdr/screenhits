db.protocols.insert({
  access: "project",
  creator: "Someone",
  name: "Viral library production, Durocher, 2016",
  project: 1,
  details: [
    {
      name: "Packaging cell line",
      details: "HEK293T, passage 14"
    },
    {
      name: "Packaging plasmids",
      details: "psPAX2 (http://www.addgene.org/12260/), p-CMV-VSV-G (https://www.addgene.org/8454/)"
    },
    {
      name: "Growth conditions",
      details: "Propagation Medium was prepared by adding 50 mL FBS to 500 mL of DMEM medium ( final concentration: 10% FBS). Medium was mixed thoroughly and stored at 4  degree_C. Cells were propagated up to a maximum of 10 passages before transfection. For splitting, cells were washed once with 1X PBS and incubated with 1X Trypsin at 37 degree_C until detachment of cells. Propagation medium was added to each flask and the cells were resuspended by gently pipetting the solution up and down. The cell suspension was distributed into new T25 or T75 flasks and incubated at 37 degree_C in a 5% CO2 incubator. Cells were splitted when a confluency of approximately 80% was reached. Cell lines were split twice a week at a ratio of 1:8."
    },
    {
      name: "Cell confluence at transfection",
      details: "75%"
    },
    {
      name: "Cell number/flask size; flask number",
      details: "4x10^6 cells/T75 flash; 10 flasks"
    },
    {
      name: "Transfection protocol",
      details: "24 h post transfection, using TRANS-IT"
    },
    {
      name: "Viral supernatent protocol",
      details: "following transfectioin with library plasmids and packaging vectors, cells were incubated for overnight. The next day DNAase I treatment was carried out to prevent undesired carryover of plasmid to virus library. At 48 post-transfection, virus-containing supernatant was harvested and filtered through a 0.22 PES filter. Virus-containing medim was snap-frozen in liquid nitrogen and stored @ -80 degrees_C."
    }
  ]
})
