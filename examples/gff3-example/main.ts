import * as d3 from 'd3';
import * as soda from "@traviswheelerlab/soda"

// let gff3Data =
// `chr1	HAVANA	gene	11869	14409	.	+	.	ID=ENSG00000223972.5;gene_id=ENSG00000223972.5;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;level=2;hgnc_id=HGNC:37102;havana_gene=OTTHUMG00000000961.2
// chr1	HAVANA	transcript	11869	14409	.	+	.	ID=ENST00000456328.2;Parent=ENSG00000223972.5;gene_id=ENSG00000223972.5;transcript_id=ENST00000456328.2;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;transcript_type=processed_transcript;transcript_name=DDX11L1-202;level=2;transcript_support_level=1;hgnc_id=HGNC:37102;tag=basic;havana_gene=OTTHUMG00000000961.2;havana_transcript=OTTHUMT00000362751.1
// chr1	HAVANA	exon	11869	12227	.	+	.	ID=exon:ENST00000456328.2:1;Parent=ENST00000456328.2;gene_id=ENSG00000223972.5;transcript_id=ENST00000456328.2;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;transcript_type=processed_transcript;transcript_name=DDX11L1-202;exon_number=1;exon_id=ENSE00002234944.1;level=2;transcript_support_level=1;hgnc_id=HGNC:37102;tag=basic;havana_gene=OTTHUMG00000000961.2;havana_transcript=OTTHUMT00000362751.1
// chr1	HAVANA	exon	12613	12721	.	+	.	ID=exon:ENST00000456328.2:2;Parent=ENST00000456328.2;gene_id=ENSG00000223972.5;transcript_id=ENST00000456328.2;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;transcript_type=processed_transcript;transcript_name=DDX11L1-202;exon_number=2;exon_id=ENSE00003582793.1;level=2;transcript_support_level=1;hgnc_id=HGNC:37102;tag=basic;havana_gene=OTTHUMG00000000961.2;havana_transcript=OTTHUMT00000362751.1
// chr1	HAVANA	exon	13221	14409	.	+	.	ID=exon:ENST00000456328.2:3;Parent=ENST00000456328.2;gene_id=ENSG00000223972.5;transcript_id=ENST00000456328.2;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;transcript_type=processed_transcript;transcript_name=DDX11L1-202;exon_number=3;exon_id=ENSE00002312635.1;level=2;transcript_support_level=1;hgnc_id=HGNC:37102;tag=basic;havana_gene=OTTHUMG00000000961.2;havana_transcript=OTTHUMT00000362751.1
// chr1	HAVANA	transcript	12010	13670	.	+	.	ID=ENST00000450305.2;Parent=ENSG00000223972.5;gene_id=ENSG00000223972.5;transcript_id=ENST00000450305.2;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;transcript_type=transcribed_unprocessed_pseudogene;transcript_name=DDX11L1-201;level=2;transcript_support_level=NA;hgnc_id=HGNC:37102;ont=PGO:0000005,PGO:0000019;tag=basic;havana_gene=OTTHUMG00000000961.2;havana_transcript=OTTHUMT00000002844.2
// chr1	HAVANA	exon	12010	12057	.	+	.	ID=exon:ENST00000450305.2:1;Parent=ENST00000450305.2;gene_id=ENSG00000223972.5;transcript_id=ENST00000450305.2;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;transcript_type=transcribed_unprocessed_pseudogene;transcript_name=DDX11L1-201;exon_number=1;exon_id=ENSE00001948541.1;level=2;transcript_support_level=NA;hgnc_id=HGNC:37102;ont=PGO:0000005,PGO:0000019;tag=basic;havana_gene=OTTHUMG00000000961.2;havana_transcript=OTTHUMT00000002844.2
// chr1	HAVANA	exon	12179	12227	.	+	.	ID=exon:ENST00000450305.2:2;Parent=ENST00000450305.2;gene_id=ENSG00000223972.5;transcript_id=ENST00000450305.2;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;transcript_type=transcribed_unprocessed_pseudogene;transcript_name=DDX11L1-201;exon_number=2;exon_id=ENSE00001671638.2;level=2;transcript_support_level=NA;hgnc_id=HGNC:37102;ont=PGO:0000005,PGO:0000019;tag=basic;havana_gene=OTTHUMG00000000961.2;havana_transcript=OTTHUMT00000002844.2
// chr1	HAVANA	exon	12613	12697	.	+	.	ID=exon:ENST00000450305.2:3;Parent=ENST00000450305.2;gene_id=ENSG00000223972.5;transcript_id=ENST00000450305.2;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;transcript_type=transcribed_unprocessed_pseudogene;transcript_name=DDX11L1-201;exon_number=3;exon_id=ENSE00001758273.2;level=2;transcript_support_level=NA;hgnc_id=HGNC:37102;ont=PGO:0000005,PGO:0000019;tag=basic;havana_gene=OTTHUMG00000000961.2;havana_transcript=OTTHUMT00000002844.2
// chr1	HAVANA	exon	12975	13052	.	+	.	ID=exon:ENST00000450305.2:4;Parent=ENST00000450305.2;gene_id=ENSG00000223972.5;transcript_id=ENST00000450305.2;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;transcript_type=transcribed_unprocessed_pseudogene;transcript_name=DDX11L1-201;exon_number=4;exon_id=ENSE00001799933.2;level=2;transcript_support_level=NA;hgnc_id=HGNC:37102;ont=PGO:0000005,PGO:0000019;tag=basic;havana_gene=OTTHUMG00000000961.2;havana_transcript=OTTHUMT00000002844.2
// chr1	HAVANA	exon	13221	13374	.	+	.	ID=exon:ENST00000450305.2:5;Parent=ENST00000450305.2;gene_id=ENSG00000223972.5;transcript_id=ENST00000450305.2;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;transcript_type=transcribed_unprocessed_pseudogene;transcript_name=DDX11L1-201;exon_number=5;exon_id=ENSE00001746346.2;level=2;transcript_support_level=NA;hgnc_id=HGNC:37102;ont=PGO:0000005,PGO:0000019;tag=basic;havana_gene=OTTHUMG00000000961.2;havana_transcript=OTTHUMT00000002844.2
// chr1	HAVANA	exon	13453	13670	.	+	.	ID=exon:ENST00000450305.2:6;Parent=ENST00000450305.2;gene_id=ENSG00000223972.5;transcript_id=ENST00000450305.2;gene_type=transcribed_unprocessed_pseudogene;gene_name=DDX11L1;transcript_type=transcribed_unprocessed_pseudogene;transcript_name=DDX11L1-201;exon_number=6;exon_id=ENSE00001863096.1;level=2;transcript_support_level=NA;hgnc_id=HGNC:37102;ont=PGO:0000005,PGO:0000019;tag=basic;havana_gene=OTTHUMG00000000961.2;havana_transcript=OTTHUMT00000002844.2
// chr1	HAVANA	gene	14404	29570	.	-	.	ID=ENSG00000227232.5;gene_id=ENSG00000227232.5;gene_type=unprocessed_pseudogene;gene_name=WASH7P;level=2;hgnc_id=HGNC:38034;havana_gene=OTTHUMG00000000958.1
// chr1	HAVANA	transcript	14404	29570	.	-	.	ID=ENST00000488147.1;Parent=ENSG00000227232.5;gene_id=ENSG00000227232.5;transcript_id=ENST00000488147.1;gene_type=unprocessed_pseudogene;gene_name=WASH7P;transcript_type=unprocessed_pseudogene;transcript_name=WASH7P-201;level=2;transcript_support_level=NA;hgnc_id=HGNC:38034;ont=PGO:0000005;tag=basic;havana_gene=OTTHUMG00000000958.1;havana_transcript=OTTHUMT00000002839.1
// chr1	HAVANA	exon	29534	29570	.	-	.	ID=exon:ENST00000488147.1:1;Parent=ENST00000488147.1;gene_id=ENSG00000227232.5;transcript_id=ENST00000488147.1;gene_type=unprocessed_pseudogene;gene_name=WASH7P;transcript_type=unprocessed_pseudogene;transcript_name=WASH7P-201;exon_number=1;exon_id=ENSE00001890219.1;level=2;transcript_support_level=NA;hgnc_id=HGNC:38034;ont=PGO:0000005;tag=basic;havana_gene=OTTHUMG00000000958.1;havana_transcript=OTTHUMT00000002839.1
// chr1	HAVANA	exon	24738	24891	.	-	.	ID=exon:ENST00000488147.1:2;Parent=ENST00000488147.1;gene_id=ENSG00000227232.5;transcript_id=ENST00000488147.1;gene_type=unprocessed_pseudogene;gene_name=WASH7P;transcript_type=unprocessed_pseudogene;transcript_name=WASH7P-201;exon_number=2;exon_id=ENSE00003507205.1;level=2;transcript_support_level=NA;hgnc_id=HGNC:38034;ont=PGO:0000005;tag=basic;havana_gene=OTTHUMG00000000958.1;havana_transcript=OTTHUMT00000002839.1
// chr1	HAVANA	exon	18268	18366	.	-	.	ID=exon:ENST00000488147.1:3;Parent=ENST00000488147.1;gene_id=ENSG00000227232.5;transcript_id=ENST00000488147.1;gene_type=unprocessed_pseudogene;gene_name=WASH7P;transcript_type=unprocessed_pseudogene;transcript_name=WASH7P-201;exon_number=3;exon_id=ENSE00003477500.1;level=2;transcript_support_level=NA;hgnc_id=HGNC:38034;ont=PGO:0000005;tag=basic;havana_gene=OTTHUMG00000000958.1;havana_transcript=OTTHUMT00000002839.1
// chr1	HAVANA	exon	17915	18061	.	-	.	ID=exon:ENST00000488147.1:4;Parent=ENST00000488147.1;gene_id=ENSG00000227232.5;transcript_id=ENST00000488147.1;gene_type=unprocessed_pseudogene;gene_name=WASH7P;transcript_type=unprocessed_pseudogene;transcript_name=WASH7P-201;exon_number=4;exon_id=ENSE00003565697.1;level=2;transcript_support_level=NA;hgnc_id=HGNC:38034;ont=PGO:0000005;tag=basic;havana_gene=OTTHUMG00000000958.1;havana_transcript=OTTHUMT00000002839.1
// chr1	HAVANA	exon	17606	17742	.	-	.	ID=exon:ENST00000488147.1:5;Parent=ENST00000488147.1;gene_id=ENSG00000227232.5;transcript_id=ENST00000488147.1;gene_type=unprocessed_pseudogene;gene_name=WASH7P;transcript_type=unprocessed_pseudogene;transcript_name=WASH7P-201;exon_number=5;exon_id=ENSE00003475637.1;level=2;transcript_support_level=NA;hgnc_id=HGNC:38034;ont=PGO:0000005;tag=basic;havana_gene=OTTHUMG00000000958.1;havana_transcript=OTTHUMT00000002839.1
// chr1	HAVANA	exon	17233	17368	.	-	.	ID=exon:ENST00000488147.1:6;Parent=ENST00000488147.1;gene_id=ENSG00000227232.5;transcript_id=ENST00000488147.1;gene_type=unprocessed_pseudogene;gene_name=WASH7P;transcript_type=unprocessed_pseudogene;transcript_name=WASH7P-201;exon_number=6;exon_id=ENSE00003502542.1;level=2;transcript_support_level=NA;hgnc_id=HGNC:38034;ont=PGO:0000005;tag=basic;havana_gene=OTTHUMG00000000958.1;havana_transcript=OTTHUMT00000002839.1
// chr1	HAVANA	exon	16858	17055	.	-	.	ID=exon:ENST00000488147.1:7;Parent=ENST00000488147.1;gene_id=ENSG00000227232.5;transcript_id=ENST00000488147.1;gene_type=unprocessed_pseudogene;gene_name=WASH7P;transcript_type=unprocessed_pseudogene;transcript_name=WASH7P-201;exon_number=7;exon_id=ENSE00003553898.1;level=2;transcript_support_level=NA;hgnc_id=HGNC:38034;ont=PGO:0000005;tag=basic;havana_gene=OTTHUMG00000000958.1;havana_transcript=OTTHUMT00000002839.1
// chr1	HAVANA	exon	16607	16765	.	-	.	ID=exon:ENST00000488147.1:8;Parent=ENST00000488147.1;gene_id=ENSG00000227232.5;transcript_id=ENST00000488147.1;gene_type=unprocessed_pseudogene;gene_name=WASH7P;transcript_type=unprocessed_pseudogene;transcript_name=WASH7P-201;exon_number=8;exon_id=ENSE00003621279.1;level=2;transcript_support_level=NA;hgnc_id=HGNC:38034;ont=PGO:0000005;tag=basic;havana_gene=OTTHUMG00000000958.1;havana_transcript=OTTHUMT00000002839.1
// chr1	HAVANA	exon	15796	15947	.	-	.	ID=exon:ENST00000488147.1:9;Parent=ENST00000488147.1;gene_id=ENSG00000227232.5;transcript_id=ENST00000488147.1;gene_type=unprocessed_pseudogene;gene_name=WASH7P;transcript_type=unprocessed_pseudogene;transcript_name=WASH7P-201;exon_number=9;exon_id=ENSE00002030414.1;level=2;transcript_support_level=NA;hgnc_id=HGNC:38034;ont=PGO:0000005;tag=basic;havana_gene=OTTHUMG00000000958.1;havana_transcript=OTTHUMT00000002839.1
// chr1	HAVANA	exon	15005	15038	.	-	.	ID=exon:ENST00000488147.1:10;Parent=ENST00000488147.1;gene_id=ENSG00000227232.5;transcript_id=ENST00000488147.1;gene_type=unprocessed_pseudogene;gene_name=WASH7P;transcript_type=unprocessed_pseudogene;transcript_name=WASH7P-201;exon_number=10;exon_id=ENSE00001935574.1;level=2;transcript_support_level=NA;hgnc_id=HGNC:38034;ont=PGO:0000005;tag=basic;havana_gene=OTTHUMG00000000958.1;havana_transcript=OTTHUMT00000002839.1
// chr1	HAVANA	exon	14404	14501	.	-	.	ID=exon:ENST00000488147.1:11;Parent=ENST00000488147.1;gene_id=ENSG00000227232.5;transcript_id=ENST00000488147.1;gene_type=unprocessed_pseudogene;gene_name=WASH7P;transcript_type=unprocessed_pseudogene;transcript_name=WASH7P-201;exon_number=11;exon_id=ENSE00001843071.1;level=2;transcript_support_level=NA;hgnc_id=HGNC:38034;ont=PGO:0000005;tag=basic;havana_gene=OTTHUMG00000000958.1;havana_transcript=OTTHUMT00000002839.1
// chr1	ENSEMBL	gene	17369	17436	.	-	.	ID=ENSG00000278267.1;gene_id=ENSG00000278267.1;gene_type=miRNA;gene_name=MIR6859-1;level=3;hgnc_id=HGNC:50039
// chr1	ENSEMBL	transcript	17369	17436	.	-	.	ID=ENST00000619216.1;Parent=ENSG00000278267.1;gene_id=ENSG00000278267.1;transcript_id=ENST00000619216.1;gene_type=miRNA;gene_name=MIR6859-1;transcript_type=miRNA;transcript_name=MIR6859-1-201;level=3;transcript_support_level=NA;hgnc_id=HGNC:50039;tag=basic
// chr1	ENSEMBL	exon	17369	17436	.	-	.	ID=exon:ENST00000619216.1:1;Parent=ENST00000619216.1;gene_id=ENSG00000278267.1;transcript_id=ENST00000619216.1;gene_type=miRNA;gene_name=MIR6859-1;transcript_type=miRNA;transcript_name=MIR6859-1-201;exon_number=1;exon_id=ENSE00003746039.1;level=3;transcript_support_level=NA;hgnc_id=HGNC:50039;tag=basic
// chr1	HAVANA	gene	29554	31109	.	+	.	ID=ENSG00000243485.5;gene_id=ENSG00000243485.5;gene_type=lncRNA;gene_name=MIR1302-2HG;level=2;hgnc_id=HGNC:52482;tag=ncRNA_host;havana_gene=OTTHUMG00000000959.2
// chr1	HAVANA	transcript	29554	31097	.	+	.	ID=ENST00000473358.1;Parent=ENSG00000243485.5;gene_id=ENSG00000243485.5;transcript_id=ENST00000473358.1;gene_type=lncRNA;gene_name=MIR1302-2HG;transcript_type=lncRNA;transcript_name=MIR1302-2HG-202;level=2;transcript_support_level=5;hgnc_id=HGNC:52482;tag=not_best_in_genome_evidence,dotter_confirmed,basic;havana_gene=OTTHUMG00000000959.2;havana_transcript=OTTHUMT00000002840.1
// chr1	HAVANA	exon	29554	30039	.	+	.	ID=exon:ENST00000473358.1:1;Parent=ENST00000473358.1;gene_id=ENSG00000243485.5;transcript_id=ENST00000473358.1;gene_type=lncRNA;gene_name=MIR1302-2HG;transcript_type=lncRNA;transcript_name=MIR1302-2HG-202;exon_number=1;exon_id=ENSE00001947070.1;level=2;transcript_support_level=5;hgnc_id=HGNC:52482;tag=not_best_in_genome_evidence,dotter_confirmed,basic;havana_gene=OTTHUMG00000000959.2;havana_transcript=OTTHUMT00000002840.1
// chr1	HAVANA	exon	30564	30667	.	+	.	ID=exon:ENST00000473358.1:2;Parent=ENST00000473358.1;gene_id=ENSG00000243485.5;transcript_id=ENST00000473358.1;gene_type=lncRNA;gene_name=MIR1302-2HG;transcript_type=lncRNA;transcript_name=MIR1302-2HG-202;exon_number=2;exon_id=ENSE00001922571.1;level=2;transcript_support_level=5;hgnc_id=HGNC:52482;tag=not_best_in_genome_evidence,dotter_confirmed,basic;havana_gene=OTTHUMG00000000959.2;havana_transcript=OTTHUMT00000002840.1
// chr1	HAVANA	exon	30976	31097	.	+	.	ID=exon:ENST00000473358.1:3;Parent=ENST00000473358.1;gene_id=ENSG00000243485.5;transcript_id=ENST00000473358.1;gene_type=lncRNA;gene_name=MIR1302-2HG;transcript_type=lncRNA;transcript_name=MIR1302-2HG-202;exon_number=3;exon_id=ENSE00001827679.1;level=2;transcript_support_level=5;hgnc_id=HGNC:52482;tag=not_best_in_genome_evidence,dotter_confirmed,basic;havana_gene=OTTHUMG00000000959.2;havana_transcript=OTTHUMT00000002840.1
// chr1	HAVANA	transcript	30267	31109	.	+	.	ID=ENST00000469289.1;Parent=ENSG00000243485.5;gene_id=ENSG00000243485.5;transcript_id=ENST00000469289.1;gene_type=lncRNA;gene_name=MIR1302-2HG;transcript_type=lncRNA;transcript_name=MIR1302-2HG-201;level=2;transcript_support_level=5;hgnc_id=HGNC:52482;tag=not_best_in_genome_evidence,basic;havana_gene=OTTHUMG00000000959.2;havana_transcript=OTTHUMT00000002841.2
// chr1	HAVANA	exon	30267	30667	.	+	.	ID=exon:ENST00000469289.1:1;Parent=ENST00000469289.1;gene_id=ENSG00000243485.5;transcript_id=ENST00000469289.1;gene_type=lncRNA;gene_name=MIR1302-2HG;transcript_type=lncRNA;transcript_name=MIR1302-2HG-201;exon_number=1;exon_id=ENSE00001841699.1;level=2;transcript_support_level=5;hgnc_id=HGNC:52482;tag=not_best_in_genome_evidence,basic;havana_gene=OTTHUMG00000000959.2;havana_transcript=OTTHUMT00000002841.2
// chr1	HAVANA	exon	30976	31109	.	+	.	ID=exon:ENST00000469289.1:2;Parent=ENST00000469289.1;gene_id=ENSG00000243485.5;transcript_id=ENST00000469289.1;gene_type=lncRNA;gene_name=MIR1302-2HG;transcript_type=lncRNA;transcript_name=MIR1302-2HG-201;exon_number=2;exon_id=ENSE00001890064.1;level=2;transcript_support_level=5;hgnc_id=HGNC:52482;tag=not_best_in_genome_evidence,basic;havana_gene=OTTHUMG00000000959.2;havana_transcript=OTTHUMT00000002841.2
// chr1	ENSEMBL	gene	30366	30503	.	+	.	ID=ENSG00000284332.1;gene_id=ENSG00000284332.1;gene_type=miRNA;gene_name=MIR1302-2;level=3;hgnc_id=HGNC:35294
// chr1	ENSEMBL	transcript	30366	30503	.	+	.	ID=ENST00000607096.1;Parent=ENSG00000284332.1;gene_id=ENSG00000284332.1;transcript_id=ENST00000607096.1;gene_type=miRNA;gene_name=MIR1302-2;transcript_type=miRNA;transcript_name=MIR1302-2-201;level=3;transcript_support_level=NA;hgnc_id=HGNC:35294;tag=basic
// chr1	ENSEMBL	exon	30366	30503	.	+	.	ID=exon:ENST00000607096.1:1;Parent=ENST00000607096.1;gene_id=ENSG00000284332.1;transcript_id=ENST00000607096.1;gene_type=miRNA;gene_name=MIR1302-2;transcript_type=miRNA;transcript_name=MIR1302-2-201;exon_number=1;exon_id=ENSE00003695741.1;level=3;transcript_support_level=NA;hgnc_id=HGNC:35294;tag=basic
// chr1	HAVANA	gene	34554	36081	.	-	.	ID=ENSG00000237613.2;gene_id=ENSG00000237613.2;gene_type=lncRNA;gene_name=FAM138A;level=2;hgnc_id=HGNC:32334;havana_gene=OTTHUMG00000000960.1
// chr1	HAVANA	transcript	34554	36081	.	-	.	ID=ENST00000417324.1;Parent=ENSG00000237613.2;gene_id=ENSG00000237613.2;transcript_id=ENST00000417324.1;gene_type=lncRNA;gene_name=FAM138A;transcript_type=lncRNA;transcript_name=FAM138A-201;level=2;transcript_support_level=1;hgnc_id=HGNC:32334;tag=basic;havana_gene=OTTHUMG00000000960.1;havana_transcript=OTTHUMT00000002842.1
// chr1	HAVANA	exon	35721	36081	.	-	.	ID=exon:ENST00000417324.1:1;Parent=ENST00000417324.1;gene_id=ENSG00000237613.2;transcript_id=ENST00000417324.1;gene_type=lncRNA;gene_name=FAM138A;transcript_type=lncRNA;transcript_name=FAM138A-201;exon_number=1;exon_id=ENSE00001656588.1;level=2;transcript_support_level=1;hgnc_id=HGNC:32334;tag=basic;havana_gene=OTTHUMG00000000960.1;havana_transcript=OTTHUMT00000002842.1
// chr1	HAVANA	exon	35277	35481	.	-	.	ID=exon:ENST00000417324.1:2;Parent=ENST00000417324.1;gene_id=ENSG00000237613.2;transcript_id=ENST00000417324.1;gene_type=lncRNA;gene_name=FAM138A;transcript_type=lncRNA;transcript_name=FAM138A-201;exon_number=2;exon_id=ENSE00001669267.1;level=2;transcript_support_level=1;hgnc_id=HGNC:32334;tag=basic;havana_gene=OTTHUMG00000000960.1;havana_transcript=OTTHUMT00000002842.1
// `;

let gff3Data = `
ctg123	.	gene	1000	9000	.	+	.	ID=gene00001;Name=EDEN
ctg123	.	TF_binding_site	1000	1012	.	+	.	ID=tfbs00001;Parent=gene00001
ctg123	.	mRNA	1050	9000	.	+	.	ID=mRNA00001;Parent=gene00001;Name=EDEN.1
ctg123	.	mRNA	1050	9000	.	+	.	ID=mRNA00002;Parent=gene00001;Name=EDEN.2
ctg123	.	mRNA	1300	9000	.	+	.	ID=mRNA00003;Parent=gene00001;Name=EDEN.3
ctg123	.	exon	1300	1500	.	+	.	ID=exon00001;Parent=mRNA00003
ctg123	.	exon	1050	1500	.	+	.	ID=exon00002;Parent=mRNA00001,mRNA00002
ctg123	.	exon	3000	3902	.	+	.	ID=exon00003;Parent=mRNA00001,mRNA00003
ctg123	.	exon	5000	5500	.	+	.	ID=exon00004;Parent=mRNA00001,mRNA00002,mRNA00003
ctg123	.	exon	7000	9000	.	+	.	ID=exon00005;Parent=mRNA00001,mRNA00002,mRNA00003
ctg123	.	CDS	1201	1500	.	+	0	ID=cds00001;Parent=mRNA00001;Name=edenprotein.1
ctg123	.	CDS	3000	3902	.	+	0	ID=cds00001;Parent=mRNA00001;Name=edenprotein.1
ctg123	.	CDS	5000	5500	.	+	0	ID=cds00001;Parent=mRNA00001;Name=edenprotein.1
ctg123	.	CDS	7000	7600	.	+	0	ID=cds00001;Parent=mRNA00001;Name=edenprotein.1
ctg123	.	CDS	1201	1500	.	+	0	ID=cds00002;Parent=mRNA00002;Name=edenprotein.2
ctg123	.	CDS	5000	5500	.	+	0	ID=cds00002;Parent=mRNA00002;Name=edenprotein.2
ctg123	.	CDS	7000	7600	.	+	0	ID=cds00002;Parent=mRNA00002;Name=edenprotein.2
ctg123	.	CDS	3301	3902	.	+	0	ID=cds00003;Parent=mRNA00003;Name=edenprotein.3
ctg123	.	CDS	5000	5500	.	+	1	ID=cds00003;Parent=mRNA00003;Name=edenprotein.3
ctg123	.	CDS	7000	7600	.	+	1	ID=cds00003;Parent=mRNA00003;Name=edenprotein.3
ctg123	.	CDS	3391	3902	.	+	0	ID=cds00004;Parent=mRNA00003;Name=edenprotein.4
ctg123	.	CDS	5000	5500	.	+	1	ID=cds00004;Parent=mRNA00003;Name=edenprotein.4
ctg123	.	CDS	7000	7600	.	+	1	ID=cds00004;Parent=mRNA00003;Name=edenprotein.4
`;

let ann: soda.Gff3Annotation[] = soda.gff3ParseFlat(gff3Data);

let genes = ann.filter((a) => a.type == 'gene');
let exons = ann.filter((a) => a.type == 'exon');
let cds = ann.filter((a) => a.type == 'CDS');

let exonCds = exons.concat(cds);
console.log(exonCds);

let parentIds: string[] = [];

for (const feat of exonCds) {
    if (feat.parent !== undefined) {
        let currentId = feat.parent.gff3Id;
        if (currentId !== undefined) {
            if (parentIds.indexOf(currentId) < 0) {
                parentIds.push(currentId);
            }
        }
    }
}
console.log(parentIds);

let groups: soda.AnnotationGroup[] = [];
for (const id of parentIds) {
    let group = exonCds.filter((ann) => {
        if (ann.parent !== undefined) {
            return (ann.parent.gff3Id == id);
        }
    });
    let annGroup = new soda.AnnotationGroup(group[0]);
    for (const ann of group) {
        annGroup.add(ann);
    }
    groups.push(annGroup);
}

console.log(groups);

const axis = new soda.AxisChart({selector: '#axis-chart'});
let chart = new soda.TrackChart({selector: '#track-chart'});

let zoomController = new soda.ZoomController();
let resizeController = new soda.ResizeController();

zoomController.addComponent(axis);
zoomController.addComponent(chart);

resizeController.addComponent(axis);
resizeController.addComponent(chart);

window.onresize = () => resizeController.trigger();

let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

let n = soda.intervalGraphLayout(groups);

let exonAnn: soda.Annotation[] = [];
groups.forEach((a) => {
    for (const b of a.group) {
        // @ts-ignore
        if (b.type == 'exon') {
            exonAnn.push(b);
        }
    }
});

let cdsAnn: soda.Annotation[] = [];
groups.forEach((a) => {
    for (const b of a.group) {
        // @ts-ignore
        if (b.type == 'CDS') {
            cdsAnn.push(b);
        }
    }
});

let renderParams: soda.TrackChartRenderParams = {
    queryStart: groups.reduce(function(prev, curr) {
        return prev.x < curr.x ? prev : curr;
    }).x,
    queryEnd: groups.reduce(function(prev, curr) {
        return (prev.x + prev.w) > (curr.x + curr.w) ? prev : curr;
    }).x2,
    maxY: (n+1)
};

axis.render(renderParams);
chart.render(renderParams);

let rectConf: soda.RectangleConfig<soda.Annotation, soda.TrackChart<soda.TrackChartRenderParams>> = {
    selector: 'exon',
    // fillColor: (d: soda.Annotation) => colorScale(d.id),
    // strokeColor: (d: soda.Annotation) => colorScale(d.id)
    fillColor: () => 'cyan',
    strokeColor: () => 'cyan',
};

soda.rectangleGlyph(chart, exonAnn, rectConf);

rectConf = {
    selector: 'cds',
    // fillColor: (d: soda.Annotation) => colorScale(d.id),
    // strokeColor: (d: soda.Annotation) => colorScale(d.id)
    fillColor: () => 'green',
    strokeColor: () => 'green',
};

soda.rectangleGlyph(chart, cdsAnn, rectConf);
