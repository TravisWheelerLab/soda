import * as soda from "@traviswheelerlab/soda"
let ann: soda.Annotation[] = `Pf_pseudo_prophage_strain_DN1	0	0	2	2031	8421	Att Scan not run	.	608266	610309	6431911	+
Pf_pseudo_prophage_strain_NA11	0	0	113	1555	5351	Att Scan not run	.	613978	615423	6431911	+
Pf_pseudo_prophage_strain_DN1	4.2e-107	0	8053	8421	8421	Att Scan not run	.	615396	615764	6431911	+
Pf_prophage_strain_X13273_1374860–1380892	0	0	3864	5108	6033	Att Scan not run	.	4053384	4054616	6431911	+
Pf_pseudo_prophage_isolate_10	1.5e-10	0	1405	1609	5681	Att Scan not run	.	4729463	4729659	6431911	+
Pf_prophage_strain_PSE305	2.5e-74	0	4275	7070	10646	Att Scan not run	.	4731940	4734698	6431911	+
Pf_pseudo_prophage_isolate_10	1.5e-10	0	1405	1609	5681	Att Scan not run	.	4736531	4736727	6431911	+
Pf_prophage_strain_PSE305	2.5e-74	0	4275	7070	10646	Att Scan not run	.	4739008	4741766	6431911	+
Pf_prophage_strain_LES400	2.1e-07	0	12716	13582	13728	Att Scan not run	.	5225953	5226798	6431911	+
Pf_prophage_strain_LRJ16	0	0	446	7779	7780	Att Scan not run	.	465795	458462	6431911	-
Pf_prophage_strain_SCV20265	0	0	1	1111	14889	Att Scan not run	.	466783	465672	6431911	-
Pf_pseudo_prophage_strain_M1608	1.6e-25	0	1286	1468	1594	Att Scan not run	.	613811	613645	6431911	-
Pf_prophage_strain_M1608_423117-5435766	0	0	417	3543	12650	Att Scan not run	.	1044912	1041795	6431911	-
Pf_prophage_strain_LES400	4.6e-119	0	12245	13639	13728	Att Scan not run	.	1057746	1056329	6431911	-
Pf_pseudo_prophage_isolate_132	1.1e-29	0	12146	12528	13243	Att Scan not run	.	3179299	3178920	6431911	-
Pf_prophage_strain_X13273_1374860–1380892	0	0	3858	5137	6033	Att Scan not run	.	3949733	3948455	6431911	-
Pf_prophage_strain_F22031	0	0	7416	8680	13393	Att Scan not run	.	4069192	4067932	6431911	-
Pf_prophage_strain_SCVfeb	6e-12	0	977	1331	15918	Att Scan not run	.	4469200	4468847	6431911	-
Pf_prophage_strain_SCVfeb	3.7e-78	0	995	1340	15918	Att Scan not run	.	5706139	5705788	6431911	-
Pf_pseudo_prophage_isolate_132	0	0	10311	13243	13243	Att Scan not run	.	5882048	5879123	6431911	-
Pf_pseudo_prophage_isolate_132	2e-28	0	10175	10329	13243	Att Scan not run	.	5882385	5882231	6431911	-
Pf_prophage_strain_LES400	0	0	10608	13728	13728	Att Scan not run	.	5887383	5884263	6431911	-
Pf_pseudo_prophage_LRJ03_16675-22524	4.3e-142	0	5383	5849	5850	Att Scan not run	.	6269386	6268920	6431911	-
Pf_prophage_strain_SCVfeb	0	0	2	2079	15918	Att Scan not run	.	6276016	6273951	6431911	-
Pf_prophage_strain_T52373_925882-939779	7.1e-30	0	12256	12420	12420	Att Scan not run	.	6373242	6373078	6431911	-
Pf_prophage_strain_12-4-4_59	0	1	1	11764	11765	Att Scan not run	.	6384889	6373126	6431911	-
Pf_prophage_strain_X24509_4097361–4109306	0	0	1	1785	11946	Att Scan not run	.	6386367	6384576	6431911	-`
    .split('\n')
    .map( (line) => {
        let split = line.split('\t')
        let start = parseInt(split[8]);
        let end = parseInt(split[9]);
        return new soda.Annotation({
           id: '',
           x: start,
           w: end - start,
           y: 0,
        })
    } );

let radialChart = new soda.RadialChart({selector: '#radial-chart', height: 500, width: 500});

let renderParams: soda.RadialChartRenderParams = {
    queryStart: 0,
    queryEnd: 6431911,
    ann: ann,
}

radialChart.initialRender(renderParams);
