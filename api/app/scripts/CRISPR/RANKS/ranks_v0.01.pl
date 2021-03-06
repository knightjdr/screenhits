#!/usr/bin/perl

my $libfile = "NA";
my $ctrlfile = "NA";
my $sginf = 0;
my $dep = 0;
my $path = './';
my $help = "Usage: perl ranks.pl [control sample sgRNA read counts] [test sample sgRNA read counts] [options] > [results file]\n
Input files should be tab-delimited text.
Read count file format: First column: read count; Second column: sgRNA ID\n
options:
\t-lib [file] : sgRNA to gene mapping file. Each line of the file should contain the sgRNA ID in the first column and the gene/feature ID(s) or name(s) in the other column(s).
\t-ctrl [file] : file with control sgRNA IDs (one per line) (Default:all sgRNAs)
\t-i : display information about each sgRNA (sgRNA:test_sample_read_count:control_sample_read_count:log2_fold-change)
\t-d : calculate sgRNA depletion score only (by default will return two scores for each gene, a negative depletion score and a positive enrichment score)

Note: Before running RANKS, you must first run once in the same folder the program which generates the control gene scores by typing:
	perl control-distribution.pl
";
	 if(!(defined $ARGV[1])){
		die $help;
	}

for(my $i = 0; $i < @ARGV; $i++){
	if ($ARGV[$i] eq '-h' || $ARGV[$i] eq '--help' || !(defined $ARGV[1])) {
		die $help;
	} elsif($ARGV[$i] eq '-lib') {
		$libfile=$ARGV[$i+1];
	} elsif($ARGV[$i] eq '-ctrl') {
		$ctrlfile=$ARGV[$i+1];
	} elsif($ARGV[$i] eq '-i'){
		$sginf=1;
	} elsif($ARGV[$i] eq '-d'){
		$dep=1;
	} elsif($ARGV[$i] eq '-p'){
		$path=$ARGV[$i+1];
	}
}
if($libfile eq 'NA'){
	print STDERR "No mapping file provivded\n\n";
	die $help;
}
if($ctrlfile ne 'NA'){
open(FILE, "$ctrlfile");
while(<FILE>){
	my @s=split /\s+/;
	$ctrl{$s[0]}=1;
	$allsg{$s[0]}=1;
}
close FILE;
}


open(FILE, "$libfile");
while(<FILE>){
	my @s=split /\s+/;
	my $sg =shift @s;
	foreach my $w (@s){
		$map{$sg}{$w}=1;
	}
	$allsg{$sg}=1;
}
close FILE;

open(FILE, $ARGV[0]);
while(<FILE>){
	my @s=split /\s+/;
	$bg{$s[1]}=$s[0];
	$bgtot+=$s[0];
}
close FILE;

open(FILE, $ARGV[1]);
while(<FILE>){
	my @s=split /\s+/;
	$fg{$s[1]}=$s[0];
	$fgtot+=$s[0];
}
close FILE;

my $pc1=1;
my $pc2=1;
foreach my $sg (keys %allsg){
	$fg{$sg}=0 if(!exists $fg{$sg});
	$bg{$sg}=0 if(!exists $bg{$sg});
	my $ratio=log(($fg{$sg}+$pc2)/($bg{$sg}+$pc1)*($bgtot/$fgtot))/log(2);
	if(exists $map{$sg}){
		foreach my $gene (keys %{$map{$sg}}){
			push @{$info{$gene}}, "$sg:$fg{$sg}:$bg{$sg}:".(int($ratio*10)/10);
			my @reads=($fg{$sg},$bg{$sg});
			$gene{$gene}{$sg}=$ratio;
		}
	}
	if($ctrlfile eq 'NA'){
		push @nt, $ratio;
	}elsif(exists $ctrl{$sg}){
		push @nt, $ratio;
	}
}

@nt=sort {$a<=>$b} @nt;
my $ntsize=@nt;

foreach my $gene (keys %gene){
	my $score=0;
	my $sg1=0;
	my $ntscore=0;
	my $ntenrich=0;
	my @scores;
	foreach my $sg (keys %{$gene{$gene}}){
		push @scores, $gene{$gene}{$sg};
		$score+=$gene{$gene}{$sg};
		my $nts=0;
		my $ratio=$gene{$gene}{$sg};
	 	if($ntsize>50000){while($nt[$nts]<=$ratio && $nts<$ntsize-1000){$nts+=1000;}
	 	while($nt[$nts]>$ratio && $nts>0){$nts-=100;}}
	 	while($nt[$nts]<$ratio && $nts<$ntsize-100){$nts+=100;}
	 	while($nt[$nts]<=$ratio && $nts<$ntsize-1){$nts++;}
		while($nt[$nts]>$ratio && $nts>0){$nts--;}
		$nts=1 if($nts<=0);
		$nts++ if($nts<$ntsize-1);
		my $nts2=$ntsize-$nts;
		$nts2=1 if($nts2<=0);
		$nts/=$ntsize;
		$nts2/=$ntsize;
		$ntscore+=log($nts);
		$ntenrich+=log($nts2);
		$sg1++;
	}
	$score=$ntscore/$sg1;
	my $text= "$gene\t$score\t$sg1\t".join("\t", @{$info{$gene}});
	my $score2=$ntenrich/$sg1;
	my $text2= "$gene\t$score2\t$sg1\t".join("\t", @{$info{$gene}});
	unshift @{$info{$gene}}, $sg1;
	unshift @{$info{$gene}}, $score;
	unshift @{$info{$gene}}, $gene;
	my @inf=($text,$score,$gene);
	my @inf2=($text2,$score2,$gene);
	push @sort, \@inf;
	push @sort2, \@inf2;
}

for(my $sgnum=1; $sgnum<=10; $sgnum++){
	my @ntsort;
	open(FILE, join('', $path, 'ctrlscores', $sgnum));
	while(<FILE>){chomp; push @ntsort, $_;}
	close FILE;
	$ntsortbysg[$sgnum]=\@ntsort;
}

if($sginf==0){
	print "Gene\tRANKS_score\tp-value\tFDR\t#_of_sgRNAs_considered\n";
}else{
	print "Gene\tRANKS_score\tp-value\tFDR\t#_of_sgRNAs_considered\tindividual_sgRNA_info(sgRNA_ID:reads_in_test_sample:reads_in_control_sample:log2_fold-change)\n";
}
foreach my $type (("depletion","enrichment")){
	next if($type eq 'enrichment' && $dep);
	my @sortall=@sort;
	my %allpv;
	my %fdr;
	@sortall=@sort2 if($type eq 'enrichment');
	for(my $sgnum=1; $sgnum<=10; $sgnum++){
		@sortfdr=();
		for(my $i=0; $i<@sortall; $i++){
			my @info=split /\t/, $sortall[$i][0];
			$info[2]=10 if($info[2]>10);
			push @sortfdr, \@{$sortall[$i]} if($info[2]==$sgnum);
		}
		my $size=@sortfdr;
		@sortfdr=sort {$a->[1]<=>$b->[1]} @sortfdr;
		next if($size==0);
		my @ntsort=@{$ntsortbysg[$sgnum]};
		my $ntsize=@ntsort;
		my $ntrank=0;
		for(my $x=0; $x<@sortfdr; $x++){
			while($ntsort[$ntrank]<=$sortfdr[$x][1] && $ntrank<@ntsort-999){$ntrank+=1000;}
			while($ntsort[$ntrank]>$sortfdr[$x][1] && $ntrank>0){$ntrank--;}
			$ntrank++;
			$allpv{$sortfdr[$x][2]}=$ntrank/$ntsize;
		}
	}
	my @g2=sort {$allpv{$a}<=>$allpv{$b}} keys %allpv;
	my $rank=1;
	my $size=@g2;
	foreach my $g (@g2){
		$fdr{$g}=$allpv{$g}*$size/$rank;
		$rank++;
	}

	my $best=1;
	@g2=reverse @g2;
	foreach my $g (@g2){
		$best=$fdr{$g} if($fdr{$g}<$best);
		$fdr{$g}=$best;
	}
	 @sortall = sort {$a->[1]<=>$b->[1]} @sortall;
	 @sortall = sort {$b->[1]<=>$a->[1]} @sortall if($type eq 'enrichment');
	 for(my $g=0; $g<@sortall; $g++){
	 	my @s=split /\s+/, $sortall[$g][0];
		$s[1]=int($s[1]*100)/100;
		$s[1]=-$s[1] if($type eq 'enrichment');
		$fdr{$s[0]}=~s/e-\d+$//;
		my $exp=$&;
		my $tenfold=0;
		while($fdr{$s[0]}<1){$fdr{$s[0]}*=10; $tenfold++;}
		$fdr{$s[0]}=((int($fdr{$s[0]}*100)/100)*10**(-$tenfold))."$exp";
		splice @s, 2, 0, "$allpv{$s[0]}\t$fdr{$s[0]}";
		if($sginf==0){print "$s[0]\t$s[1]\t$s[2]\t$s[3]\n";}else{
	 	print join("\t", @s)."\n";}
	}
}
