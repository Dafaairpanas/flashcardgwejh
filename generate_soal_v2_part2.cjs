const fs = require('fs');
const path = require('path');

const outDir = path.resolve('./public/soal');

const dataSoalPart2 = {
  "bab09": [
    { q: "Saya suka masakan Italia dan sering memakannya.", a: "わたし は イタリアりょうり が すき で、 よく たべます" },
    { q: "Karena anak saya benci sayuran, dia sama sekali tidak makan.", a: "こども は やさい が きらい です から、 ぜんぜん たべません" },
    { q: "Sdr. Miller pandai bernyanyi dan menari lho.", a: "ミラーさん は うた と ダンス が じょうず です よ" },
    { q: "Saya tidak begitu pandai bahasa Inggris, tapi mengerti bahasa Jepang sedikit.", a: "わたし は えいご が あまり じょうず じゃ ありません が、 にほんご が すこし わかります" },
    { q: "Saya tidak mengerti bahasa Prancis sama sekali.", a: "フランスご が ぜんぜん わかりません" },
    { q: "Karena besok sibuk, saya tidak akan pergi ke pesta.", a: "あした いそがしい です から、 パーティー へ いきません" },
    { q: "Apakah kamu punya banyak uang dan waktu?", a: "おかね と じかん が たくさん あります か" },
    { q: "Saya ada janji menonton film hari ini.", a: "きょう えいが を みる やくそく が あります" }, // perpaduan advance
    { q: "Istri saya pandai memasak, tapi benci bersih-bersih.", a: "つま は りょうり が じょうず です が、 そうじ が きらい です" },
    { q: "Kenapa kamu membaca koran setiap pagi?", a: "どうして まいあさ しんぶん を よみます か" },
    { q: "Karena saya menyukai berita dan ingin belajar.", a: "ニュース が すき です から、 そして べんきょう したい です から" },
    { q: "Apakah ada keperluan minggu depan?", a: "らいしゅう ようじ が あります か" },
    { q: "Kamera ini murah dan bagus, makanya saya beli.", a: "この カメラ は やすくて いい です から、 かいました" },
    { q: "Suami saya tidak punya hobi dan sering sakit.", a: "おっと は しゅみ が ありません し、 よく びょうき に なります" }, // advanced mixing
    { q: "Apakah kamu suka minum bir? Tidak, saya benci.", a: "ビール を のむ の が すき です か。いいえ、きらい です" },
    { q: "Karena tidak punya uang, saya tidak membeli kamera.", a: "おかね が ありません から、 カメラ を かいません でした" },
    { q: "Bunga ini cantik tapi mahal ya.", a: "この はな は きれい です が、たかい です ね" },
    { q: "Apa olahraga yang kamu paling sukai?", a: "スポーツ で なに が いちばん すき です か" },
    { q: "Sdr. Yamada pandai olahraga tapi saya tidak pandai.", a: "やまださん は スポーツ が じょうず です が、 わたし は へた です" },
    { q: "Kenapa kamu pulang cepat? Karena sakit.", a: "どうして はやく かえります か。びょうき です から" }
  ],
  "bab10": [
    { q: "Di taman ada banyak pohon dan bunga yang indah.", a: "こうえん に き と きれいな はな が たくさん あります" },
    { q: "Di bawah meja ada kucing dan anjing tidur.", a: "つくえ の した に ねこ と いぬ が います" },
    { q: "Di antara gedung bank dan supermarket ada toko buku.", a: "ぎんこう と スーパー の あいだ に ほんや が あります" },
    { q: "Tolong ambilkan buku yang ada di atas laci.", a: "ひきだし の うえ に ある ほん を とって ください" }, // advanced
    { q: "Di dalam kotak ini ada apa saja?", a: "この はこ の なか に なに が あります か" },
    { q: "Ada jam tangan antik, kacamata, dan lain-lain.", a: "ふるい とけい や めがね など が あります" },
    { q: "Sdr. Tanaka sedang berada di dalam ruang rapat.", a: "たなかさん は かいぎしつ の なか に います" },
    { q: "Di dekat stasiun ada kedai kopi yang enak dan murah.", a: "えき の ちかく に おいしくて やすい きっさてん が あります" },
    { q: "Tempat pensil ada di mana? Ada di sebelah kanan kamus.", a: "ふでばこ は どこ に あります か。じしょ の みぎ に あります" },
    { q: "Di luar jendela terlihat burung terbang.", a: "まど の そと に とり が います" },
    { q: "Apakah di lobi ada siapa-siapa?", a: "ロビー に だれか います か" },
    { q: "Tidak, tidak ada siapa-siapa sama sekali.", a: "いいえ、だれも いません" },
    { q: "Rumah sakit ada di sebelah kantor pos.", a: "びょういん は ゆうびんきょく の となり に あります" },
    { q: "Saya menunggu di belakang mesin tiket.", a: "けんばいき の うしろ で まちます" },
    { q: "Di kulkas tidak ada apapun.", a: "れいぞうこ の なか に なにも ありません" },
    { q: "Kucing putih itu ada di pojok ruangan.", a: "あの しろい ねこ は へや の すみ に います" },
    { q: "Anak laki-laki ada di depan pintu masuk.", a: "おとこのこ は ドア の まえ に います" },
    { q: "Di kamar tidur ada kasur, meja, rak buku, dsb.", a: "しんしつ に ベッド や つくえ や ほんだな など が あります" },
    { q: "Toko Sdr. Yamada ada di mana?", a: "やまださん の みせ は どこ に あります か" },
    { q: "Ada di bawah jembatan itu.", a: "あの はし の した に あります" }
  ],
  "bab11": [
    { q: "Saya ingin membeli tiga buah jeruk dan dua buah apel.", a: "みかん を みっつ と りんご を ふたつ かいたい です" },
    { q: "Di meja ada lima lembar kertas, tolong ambilkan.", a: "つくえ に かみ が ごまい あります、とって ください" },
    { q: "Di garasi ada 4 unit mobil buatan Jerman.", a: "車庫 に ドイツ の くるま が よんだい あります" }, // advanced bunpou
    { q: "Saya sudah belajar bahasa Jepang selama kurang lebih setengah tahun.", a: "わたし は はんとし ぐらい にほんご を べんきょう しました" },
    { q: "Dari rumah ke universitas memakan waktu sekitar satu jam setengah.", a: "うち から だいがく まで いちじかん はん ぐらい かかります" },
    { q: "Dalam seminggu, saya berolahraga sebanyak 3 kali.", a: "いっしゅうかん に さんかい スポーツ を します" },
    { q: "Keluarga saya ada 6 orang, termasuk saya.", a: "わたし の かぞく は わたし を いれて ろくにん います" }, // advanced
    { q: "Tolong berikan tiket masuk ini sebanyak 8 lembar.", a: "この きっぷ を はちまい ください" },
    { q: "Hanya butuh 5 menit berjalan kaki ke stasiun lho.", a: "えき まで あるいて ごふん しか かかりません よ" }, // shika + masen
    { q: "Berapa banyak kemeja putih yang kamu punya?", a: "しろい シャツ が なんまい あります か" },
    { q: "Saya memesan dua porsi kari dan tiga buah roti.", a: "カレー を ふたつ と パン を みっつ ちゅうもん します" },
    { q: "Sdr. Miller mempunyai dua orang anak laki-laki.", a: "ミラーさん は おとこのこ が ふたり います" },
    { q: "Di taman ada berapa ekor anjing?", a: "こうえん に いぬ が なんびき います か" }, // biki/hiki
    { q: "Dalam setahun kamu libur panjang berapa kali?", a: "いちねん に なんかい ながい やすみ を とります か" },
    { q: "Saya pergi jalan-jalan bersama tiga orang teman.", a: "ともだち さんにん と さんぽ し に いきました" },
    { q: "Saya makan sandwich satu saja tadi pagi.", a: "けさ サンドイッチ を ひとつ だけ たべました" },
    { q: "Pengiriman barang ke Tokyo butuh berapa hari?", a: "とうきょう まで にもつ は なんにち かかります か" },
    { q: "Dua hari saja sudah cukup.", a: "ふつか だけで いい です" },
    { q: "Di kelas bahasa Jepang ada 10 mahasiswa asing.", a: "にほんご の クラス に りゅうがくせい が じゅうにん います" },
    { q: "Kirim surat ini tolong bayar prangko 3 lembar.", a: "この てがみ を おくる に きって が さんまい いります" }
  ],
  "bab12": [
    { q: "Ujian minggu lalu tidak begitu sulit, tapi panjang.", a: "せんしゅう の しけん は あまり むずかしくない でした が、 ながかった です" },
    { q: "Kemarin cuacanya hujan lebat, jadi sangat dingin.", a: "きのう は おおあめ でした から、 とても さむかった です" },
    { q: "Taman bermain di sana tidak terlalu ramai kemarin lusa.", a: "おととい、 あそこ の ゆうえんち は あまり にぎやか じゃ ありません でした" },
    { q: "Pesawat lebih cepat daripada kapal, tetapi mahal.", a: "ひこうき は ふね より はやい です が、 たかい です" },
    { q: "Di antara Tokyo dan Kyoto, kamu lebih suka tinggal di mana?", a: "とうきょう と きょうと と どちら が すみたい です か" }, // combined bunpou
    { q: "Saya lebih suka di Kyoto, karena lebih tenang.", a: "きょうと の ほう が すき です。しずか です から" },
    { q: "Di seluruh dunia, negara apa yang paling kamu sukai?", a: "せかい で どの くに が いちばん すき です か" },
    { q: "Tentu saja negara sendiri yang paling indah.", a: "もちろん じぶん の くに が いちばん きれい だ と おもいます" }, // added omou
    { q: "Hotel tempat menginap kemarin kamarnya kecil dan tidak bagus.", a: "きのう の ホテル は へや が ちいさくて、 よくない でした" },
    { q: "Film itu seru sekali! Dibandingkan film lain, ini yang terbaik.", a: "あの えいが は とても おもしろかった です！ ほか の より いちばん いい です" },
    { q: "Dulu rambut saya panjang, tapi sekarang pendek.", a: "むかし わたし の かみ は ながかった です が、 いま は みじかい です" },
    { q: "Kamera ini lebih ringan daripada kamus itu.", a: "この カメラ は あの じしょ より かるい です" },
    { q: "Di antara musim, musim gugur adalah yang paling sejuk.", a: "きせつ で あき が いちばん すずしい です" },
    { q: "Tas merek ini harganya mahal dan dulu berat sekali.", a: "この かばん は たかくて、 むかし は とても おもかった です" },
    { q: "Apakah liburan panjang menyenangkan? Tidak, membosankan.", a: "ながい やすみ は たのしかった です か。いいえ、つまらない でした" },
    { q: "Restoran kemarin pelayanannya buruk.", a: "きのう の レストラン は サービス が わるい でした" }, // atau yokunai deshita
    { q: "Makan di luar lebih mahal daripada makan di rumah.", a: "そと で たべる ほう が うち で たべる より たかい です" },
    { q: "Pesta kemarin siapa yang paling sibuk?", a: "きのう の パーティー は だれ が いちばん いそがしかった です か" },
    { q: "Ibu yang paling sibuk memasak masakan.", a: "はは が りょうり で いちばん いそがしかった です" },
    { q: "Pemandangan dari sini luar biasa indah ya kemarin.", a: "きのう ここ から の けしき は すばらしく きれい でした ね" }
  ],
  "bab13": [
    { q: "Setelah mendapat gaji, saya paling menginginkan komputer canggih.", a: "きゅうりょう を もらってから、 いい コンピューター が いちばん ほしい です" },
    { q: "Karena hari ini panas, saya ingin makan es krim yang dingin.", a: "きょう は あつい です から、 つめたい アイスクリーム が たべたい です" },
    { q: "Saat sedang lelah, saya tidak ingin melakukan apapun sama sekali.", a: "つかれた とき、 なにも したくない です" }, // bab 23 combined slightly but mostly 13
    { q: "Besok saya pergi ke bandara untuk menjemput orang tua.", a: "あした わたし は くうこう へ りょうしん を むかえ に いきます" },
    { q: "Teman saya datang ke Jepang untuk belajar ekonomi di universitas.", a: "ともだち は にほん へ だいがく で けいざい を べんきょう し に きました" },
    { q: "Anak saya benci sayur, jadi dia tidak ingin memakannya.", a: "こども は やさい が きらい です から、 たべたくない です" },
    { q: "Kamu paling ingin bertemu dengan siapa sekarang?", a: "いま だれ に いちばん あいたい です か" },
    { q: "Saya masuk ke warung kopi itu untuk meminum teh hangat.", a: "あの きっさてん へ あたたかい おちゃ を のみ に はいりました" },
    { q: "Sabtu depan, ayo kita pergi berbelanja di Ginza bersama.", a: "らいしゅう の どようび、 いっしょに ぎんざ へ かいもの に いきましょう" },
    { q: "Saya mengundang teman ke rumah untuk bermain game bersama.", a: "ともだち を うち へ ゲーム を し に よびました" },
    { q: "Kamu tidak lelah? Ingin beristirahat sebentar?", a: "つかれない です か。すこし やすみたい です か" },
    { q: "Hari ini perut saya sakit, jadi tidak mau makan apapun.", a: "きょう は おなか が いたい です から、 なにも たべたくない です" },
    { q: "Istri saya menginginkan tas baru yang mahal itu.", a: "つま は あの たかい あたらしい かばん を ほしがって います" }, // advanced 3rd person
    { q: "Musim panas tahun depan, saya ingin pergi ke laut untuk berenang.", a: "らいねん の なつ、 うみ へ およぎ に いきたい です" },
    { q: "Karena sudah lapar, saya mau mampir ke sana untuk makan ramen.", a: "おなか が すきました から、 あそこ へ ラーメン を たべ に よりたい です" },
    { q: "Kamu haus? Ingin minum bir dingin?", a: "のど が かわきました か。つめたい ビール を のみたい です か" },
    { q: "Bulan lalu saya kembali ke negara asal untuk menikah.", a: "せんげつ くに へ けっこん し に かえりました" },
    { q: "Waktu luang kamu biasanya apa yang paling kamu inginkan?", a: "ひまな とき なに が いちばん ほしい です か" },
    { q: "Saya cuma menginginkan ketenangan dan tidur.", a: "しずか な じかん と すいみん だけ が ほしい です" },
    { q: "Guru datang ke perpustakaan untuk membaca buku sejarah.", a: "せんせい は としょかん へ れきし の ほん を よみ に きました" }
  ],
  "bab14": [
    { q: "Karena sangat panas, tolong nyalakan AC sekarang.", a: "とても あつい です から、 いま エアコン を つけて ください" },
    { q: "Jangan cepat-cepat! Tolong tunggu sebentar di sini.", a: "いそがないで！ ここ で ちょっと まって ください" },
    { q: "Sdr. Miller sedang mengobrol dengan presiden direktur di ruang rapat.", a: "ミラーさん は かいぎしつ で しゃちょう と はなして います" },
    { q: "Karena hujan mulai turun lebat, mari saya panggilkan taksi.", a: "あめ が おおきく ふって います から、 タクシー を よびましょう か" }, // advance form
    { q: "Bolehkah saya membawakan dua tas besar milik Anda ini?", a: "この あなた の おおきな かばん を ふたつ もちましょう か" },
    { q: "Maaf, tolong pelankan suara radionya sedikit.", a: "すみません、 ラジオ の おと を もう すこし ちいさく して ください" }, // adv adj usage
    { q: "Tolong buka pintu itu lebar-lebar karena udara gerah.", a: "むしあつい です から、 あの ドア を おおきく あけて ください" },
    { q: "Sekarang kakak perempuan saya sedang membuat kue di dapur.", a: "いま あね は だいどころ で ケーキ を つくって います" },
    { q: "Lihatlah ke sana! Ada burung yang sangat indah lho.", a: "あそこ を みて ください！ とても きれいな とり が います よ" },
    { q: "Tolong belok ke kanan di perempatan lampu merah itu.", a: "あの しんごう の こうさてん を みぎ へ まがって ください" },
    { q: "Di stasiun ini, tolong perlihatkan tiket kepada petugas.", a: "この えき で、 えきいん に きっぷ を みせて ください" },
    { q: "Hati-hati ya saat menyeberang jalan ini.", a: "この みち を わたる とき、 き を つけて ください" },
    { q: "Kakak laki-laki sedang berdiri membaca koran di lobi.", a: "あに は ロビー で たって しんぶん を よんで います" },
    { q: "Waktu tidak cukup, jadi tolong cepat panggil taksi.", a: "じかん が ありません から、 はやく タクシー を よんで ください" },
    { q: "Salju sedang turun dengan sangat lebat di luar.", a: "そと で ゆき が とても おおく ふって います" },
    { q: "Mari saya pinjamkan payung ini kepadamu.", a: "あなた に この かさ を かしましょう か" },
    { q: "Tolong tulis nama lengkapmu menggunakan huruf kanji.", a: "なまえ を ぜんぶ かんじ で かいて ください" },
    { q: "Mohon ingat kosakata bahasa Jepang sebelum ujian.", a: "しけん の まえ に、 にほんご の ことば を おぼえて ください" },
    { q: "Guru sedang menerangkan tata bahasa kepada siswa di kelas.", a: "せんせい は きょうしつ で がくせい に ぶんぽう を おしえて います" },
    { q: "Aku mau mematikan TV, apakah kamu sedang menontonnya?", a: "テレビ を けしましょう か。いま みて います か" }
  ],
  "bab15": [
    { q: "Bolehkah saya mengambil foto di dalam kuil ini? Tidak, tidak boleh.", a: "この おてら の なか で しゃしん を とって も いい です か。いいえ、とって は いけません" },
    { q: "Di pameran ini, tolong jangan menyentuh barang buatan luar negeri.", a: "この てんらんかい で、 がいこく の けんぶつ に さわって は いけません" },
    { q: "Bolehkah saya membawa pulang katalog ini ke rumah?", a: "この カタログ を うち へ もって かえって も いい です か" },
    { q: "Apakah kamu kenal orang yang berdiri menggunakan kacamata hitam itu?", a: "あの くろい めがね を かけて たって いる ひと を しって います か" },
    { q: "Kakak saya tinggal di Osaka dan bekerja memproduksi mobil.", a: "あに は おおさか に すんで いて、 くるま を つくって います" }, // te-form connecting
    { q: "Ponsel saya rusak, bolehkah saya meminjam telepon di sini?", a: "わたし の けいたい が こわれました、ここ の でんわ を つかって も いい です か" },
    { q: "Di perpustakaan dilarang makan dan minum dengan ribut.", a: "としょかん で は うるさく のんで たべて は いけません" },
    { q: "Sdr. Miller tahu nomor telepon perusahaan taksi itu tidak?", a: "ミラーさん は あの タクシー かいしゃ の でんわばんごう を しって います か" },
    { q: "Bolehkah saya menghisap rokok di bangku dekat jendela ini?", a: "まど の ちかく の ベンチ で たばこ を すって も いい です か" },
    { q: "Mobil Sdr. Suzuki sangat unik, dia membelinya 10 tahun lalu lho.", a: "すずきさん の くるま は ユニーク で、 １０ねん まえ に かって もちました よ" }, // owning state
    { q: "Dilarang memarkir mobil di depan rumah sakit ini.", a: "この びょういん の まえ に くるま を とめて は いけません" },
    { q: "Karena di luar hujan lebat, bolehkah tutup jendelanya?", a: "そと は おおあめ です から、 まど を しめて も いい です か" },
    { q: "Di museum dilarang menggunakan lampu kilat kamera.", a: "はくぶつかん で カメラ の フラッシュ を つかって は いけません" },
    { q: "Ayah saya menjual perangkat lunak komputer di Tokyo.", a: "ちち は とうきょう で コンピューター の ソフト を うって います" },
    { q: "Saya tidak tahu jam berapa rapat akan dimulai hari ini.", a: "きょう の かいぎ が なんじ に はじまる か しりません" }, // advanced 
    { q: "Guru sedang memegang kapur tulis di depan kelas.", a: "せんせい は きょうしつ の まえ で チョーク を もって います" },
    { q: "Bolehkah saya masuk ruangan sekarang? Tolong tunggu di luar.", a: "いま へや へ はいって も いい です か。そと で まって ください" },
    { q: "Menikah dengan warga asing adalah hal yang menarik.", a: "がいこくじん と けっこん して いる の は おもしろい です" },
    { q: "Dilarang membuang sampah sembarangan di sungai ini.", a: "この かわ に ごみ を すてて は いけません" },
    { q: "Bolehkah meminjam kamus Sdr. Kimura sebentar saja?", a: "きむらさん の じしょ を ちょっと かりて も いい です か" }
  ]
};

// Format
for (let bab in dataSoalPart2) {
  dataSoalPart2[bab] = dataSoalPart2[bab].map(obj => ({
    question: obj.q || obj.question,
    answer: obj.a || obj.answer
  }));
}

fs.writeFileSync(path.join(outDir, 'bab_part2_temp.json'), JSON.stringify(dataSoalPart2, null, 2));
console.log('Part 2 saved.');
