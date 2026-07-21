import fs from 'fs';
import path from 'path';

const outDir = path.resolve('./public/soal');

const dataSoal = {
  "bab02": [
    { question: "Ini adalah buku.", answer: "これ は ほん です" },
    { question: "Itu (dekat lawan bicara) adalah majalah.", answer: "それ は ざっし です" },
    { question: "Itu (jauh) adalah kamus.", answer: "あれ は じしょ です" },
    { question: "Buku ini adalah milik saya.", answer: "この ほん は わたし の です" },
    { question: "Payung itu milik siapa?", answer: "その かさ は だれ の です か" },
    { question: "Ini adalah majalah komputer.", answer: "これ は コンピューター の ざっし です" },
    { question: "Apakah ini bolpoin? (Bukan, bukan bolpoin)", answer: "これ は ボールペン です か。（いいえ、そう じゃ ありません）" },
    { question: "Buku catatan itu adalah milik Sdr. Yamada.", answer: "あの ノート は やまださん の です" }
  ],
  "bab03": [
    { question: "Di sini adalah ruang kelas.", answer: "ここ は きょうしつ です" },
    { question: "Kamar mandi ada di sana.", answer: "トイレ は あそこ です" },
    { question: "Kantin ada di sebelah mana?", answer: "しょくどう は どちら です か" },
    { question: "Ruang rapat ada di sana (dekat lawan bicara).", answer: "かいぎしつ は そこ です" },
    { question: "Sdr. Miller ada di kantor.", answer: "ミラーさん は じむしょ です" },
    { question: "Jam tangan ini harganya berapa?", answer: "この とけい は いくら です か" },
    { question: "Harganya 5.800 Yen.", answer: "ごせん はっぴゃく えん です" },
    { question: "Kamera ini buatan mana?", answer: "この カメラ は どこ の です か" }
  ],
  "bab04": [
    { question: "Sekarang jam 9.", answer: "いま ９じ です" },
    { question: "Sekarang jam berapa?", answer: "いま なんじ です か" },
    { question: "Hari ini hari Senin.", answer: "きょう は げつようび です" },
    { question: "Besok saya bangun jam 6 pagi.", answer: "あした わたし は あさ ６じ に おきます" },
    { question: "Kemarin saya tidak belajar.", answer: "きのう べんきょう しません でした" },
    { question: "Perusahaan buka dari jam 9 sampai jam 5.", answer: "かいしゃ は ９じ から ５じ まで です" },
    { question: "Setiap malam saya tidur jam 11.", answer: "まいばん １１じ に ねます" },
    { question: "Hari apa perpustakaan libur?", answer: "としょかん は なんようび やすみ です か" }
  ],
  "bab05": [
    { question: "Saya pergi ke Tokyo.", answer: "わたし は とうきょう へ いきます" },
    { question: "Minggu lalu saya datang ke Jepang.", answer: "せんしゅう にほん へ きました" },
    { question: "Kemarin saya tidak pergi ke mana-mana.", answer: "きのう どこ も いきません でした" },
    { question: "Saya pulang ke rumah naik kereta.", answer: "でんしゃ で うち へ かえります" },
    { question: "Kamu datang ke sini dengan siapa?", answer: "だれ と ここ へ きました か" },
    { question: "Saya pergi sendiri.", answer: "ひとりで いきます" },
    { question: "Kapan Sdr. Miller datang ke Jepang?", answer: "いつ ミラーさん は にほん へ きました か" },
    { question: "Bulan depan saya akan pulang ke negara asal.", answer: "らいげつ くに へ かえります" }
  ],
  "bab06": [
    { question: "Saya makan roti.", answer: "わたし は パン を たべます" },
    { question: "Apakah kamu minum teh?", answer: "おちゃ を のみます か" },
    { question: "Saya tidak merokok.", answer: "たばこ を すいません" },
    { question: "Tadi pagi saya tidak makan apa-apa.", answer: "けさ なにも たべません でした" },
    { question: "Saya membaca koran di stasiun.", answer: "えき で しんぶん を よみます" },
    { question: "Maukah menonton film bersama?", answer: "いっしょに えいが を みません か" },
    { question: "Ayo istirahat sebentar.", answer: "すこし やすみましょう" },
    { question: "Apa yang kamu lakukan kemarin?", answer: "きのう なに を しました か" }
  ],
  "bab07": [
    { question: "Saya makan menggunakan sumpit.", answer: "わたし は はし で たべます" },
    { question: "Terima kasih dalam bahasa Jepang apa?", answer: "ありがとう は にほんご で なん です か" },
    { question: "Saya menulis surat menggunakan komputer.", answer: "コンピューター で てがみ を かきます" },
    { question: "Saya memberikan bunga kepada ibu.", answer: "わたし は はは に はな を あげます" },
    { question: "Saya menerima kado dari Sdr. Karina.", answer: "カリナさん に（から） プレゼント を もらいました" },
    { question: "Apakah kamu sudah mengirim email?", answer: "もう メール を おくりました か" },
    { question: "Belum. Saya akan mengirimkannya sekarang.", answer: "いいえ、まだ です。これから おくります" },
    { question: "Sdr. Santos menelepon perusahaan.", answer: "サントスさん は かいしゃ に でんわ を かけます" }
  ],
  "bab08": [
    { question: "Gunung Fuji itu tinggi.", answer: "ふじさん は たかい です" },
    { question: "Jepang adalah negara yang bersih.", answer: "にほん は きれいな くに です" },
    { question: "Kota Sakura tidak sepi.", answer: "さくらまち は しずか じゃ ありません" },
    { question: "Kamera ini tidak mahal.", answer: "この カメラ は たかくない です" },
    { question: "Bahasa Jepang bagaimana?", answer: "にほんご は どう です か" },
    { question: "Susah, tetapi menyenangkan.", answer: "むずかしい です が、 おもしろい です" },
    { question: "Pekerjaannya sangat sibuk.", answer: "しごと は とても いそがしい です" },
    { question: "Mobil Sdr. Miller yang mana?", answer: "ミラーさん の くるま は どれ です か" }
  ],
  "bab09": [
    { question: "Saya suka masakan Italia.", answer: "わたし は イタリアりょうり が すき です" },
    { question: "Saya tidak begitu suka olahraga.", answer: "スポーツ は あまり すき じゃ ありません" },
    { question: "Sdr. Miller pandai berbahasa Jepang.", answer: "ミラーさん は にほんご が じょうず です" },
    { question: "Saya sedikit mengerti bahasa Inggris.", answer: "わたし は えいご が すこし わかります" },
    { question: "Saya tidak mengerti bahasa Mandarin sama sekali.", answer: "ちゅうごくご が ぜんぜん わかりません" },
    { question: "Saya punya banyak uang.", answer: "おかね が たくさん あります" },
    { question: "Saya tidak punya waktu.", answer: "じかん が ありません" },
    { question: "Karena besok sibuk, saya tidak akan pergi.", answer: "あした いそがしい です から、 いきません" }
  ],
  "bab10": [
    { question: "Di kamar ada meja dan kursi.", answer: "へや に つくえ と いす が あります" },
    { question: "Di lobi ada Sdr. Miller.", answer: "ロビー に ミラーさん が います" },
    { question: "Toko buku ada di dekat stasiun.", answer: "ほんや は えき の ちかく に あります" },
    { question: "Kucing ada di bawah meja.", answer: "ねこ は つくえ の した に います" },
    { question: "Ada siapa di sana?", answer: "あそこ に だれ が います か" },
    { question: "Tidak ada siapa-siapa.", answer: "だれ も いません" },
    { question: "Tas ada di mana?", answer: "かばん は どこ に あります か" },
    { question: "Di sebelah kanan ada bank.", answer: "みぎ に ぎんこう が あります" }
  ],
  "bab11": [
    { question: "Ada tiga buah apel.", answer: "りんご が みっつ あります" },
    { question: "Saya membeli dua lembar prangko.", answer: "きって を にまい かいました" },
    { question: "Di kelas ada 5 orang mahasiswa asing.", answer: "きょうしつ に りゅうがくせい が ごにん います" },
    { question: "Berapa banyak komputer yang ada?", answer: "コンピューター が なんだい あります か" },
    { question: "Keluarga saya ada empat orang.", answer: "かぞく は よにん です" },
    { question: "Dalam setahun, saya pulang ke kampung halaman dua kali.", answer: "１ねん に にかい くに へ かえります" },
    { question: "Saya sudah belajar bahasa Jepang selama setengah tahun.", answer: "はんとし にほんご を べんきょう しました" },
    { question: "Dari stasiun ke sekolah butuh waktu berapa lama?", answer: "えき から がっこう まで どのくらい かかります か" }
  ],
  "bab12": [
    { question: "Kemarin cuacanya cerah.", answer: "きのう は いい てんき でした" },
    { question: "Pesta kemarin tidak ramai.", answer: "きのう の パーティー は にぎやか じゃ ありません でした" },
    { question: "Ujian minggu lalu sangat sulit.", answer: "せんしゅう の しけん は とても むずかしかった です" },
    { question: "Film kemarin tidak menarik.", answer: "きのう の えいが は おもしろくない でした" },
    { question: "Mobil ini lebih cepat daripada sepeda.", answer: "この くるま は じてんしゃ より はやい です" },
    { question: "Di antara Hokkaido dan Kyushu, mana yang lebih dingin?", answer: "ほっかいどう と きゅうしゅう と どちら が さむい です か" },
    { question: "Hokkaido yang lebih dingin.", answer: "ほっかいどう の ほう が さむい です" },
    { question: "Di antara olahraga, tenis yang paling menarik.", answer: "スポーツ で テニス が いちばん おもしろい です" }
  ],
  "bab13": [
    { question: "Saya menginginkan mobil baru.", answer: "わたし は あたらしい くるま が ほしい です" },
    { question: "Sekarang kamu paling menginginkan apa?", answer: "いま なに が いちばん ほしい です か" },
    { question: "Saya ingin makan sushi.", answer: "わたし は すし を（が） たべたい です" },
    { question: "Liburan nanti, kamu ingin melakukan apa?", answer: "やすみ に なに を したい です か" },
    { question: "Saya tidak ingin melakukan apapun.", answer: "なにも したくない です" },
    { question: "Saya pergi ke Hokkaido untuk bermain ski.", answer: "ほっかいどう へ スキー に いきます" },
    { question: "Saya pergi ke restoran untuk makan malam.", answer: "レストラン へ ばんごはん を たべ に いきます" },
    { question: "Ayo kita pergi minum kopi.", answer: "コーヒー を のみ に いきましょう" }
  ],
  "bab14": [
    { question: "Tolong nyalakan AC.", answer: "エアコン を つけて ください" },
    { question: "Tolong baca buku ini.", answer: "この ほん を よんで ください" },
    { question: "Permisi, tolong ambilkan garam itu.", answer: "すみません、その しお を とって ください" },
    { question: "Tolong tunggu sebentar.", answer: "ちょっと まって ください" },
    { question: "Sekarang sedang turun hujan.", answer: "いま あめ が ふって います" },
    { question: "Saya sedang menelepon Sdr. Tanaka.", answer: "わたし は たなかさん に でんわ を かけて います" },
    { question: "Maukah saya bawakan barang bawaanmu?", answer: "にもつ を もちましょう か" },
    { question: "Terima kasih, tolong (bawakan).", answer: "ありがとう ございます。おねがい します" }
  ],
  "bab15": [
    { question: "Bolehkah saya mengambil foto?", answer: "しゃしん を とって も いい です か" },
    { question: "Ya, boleh.", answer: "ええ、いい です よ" },
    { question: "Bolehkah saya merokok di sini?", answer: "ここ で たばこ を すって も いい です か" },
    { question: "Maaf, tidak boleh.", answer: "すみません、ちょっと......" },
    { question: "Di sini tidak boleh memarkirkan mobil.", answer: "ここ に くるま を とめて は いけません" },
    { question: "Saya tinggal di Osaka.", answer: "わたし は おおさか に すんで います" },
    { question: "Apakah kamu kenal dengan Sdr. Miller?", answer: "ミラーさん を しって います か" },
    { question: "Saya bekerja di IMC.", answer: "わたし は ＩＭＣ で はたらいて います" }
  ],
  "bab17": [
    { question: "Tolong jangan merokok.", answer: "たばこ を すわない で ください" },
    { question: "Tolong jangan lupakan masalah ini.", answer: "この こと を わすれない で ください" },
    { question: "Saya harus segera pulang.", answer: "わたし は すぐ かえらなければ なりません" },
    { question: "Setiap hari harus meminum obat.", answer: "まいにち くすり を のまなければ なりません" },
    { question: "Besok tidak perlu datang juga tidak apa-apa.", answer: "あした こなくても いい です" },
    { question: "Hari Sabtu tidak perlu bekerja.", answer: "どようび は はたらかなくても いい です" },
    { question: "Tolong tulis laporan bahasa Jepang.", answer: "にほんご の レポート を かいて ください" },
    { question: "Paspor jangan sampai hilang.", answer: "パスポート を なくさない で ください" }
  ],
  "bab18": [
    { question: "Saya bisa berbicara bahasa Jepang.", answer: "わたし は にほんご を はなす こと が できます" },
    { question: "Apakah bisa membayar menggunakan kartu?", answer: "カード で はらう こと が できます か" },
    { question: "Hobi saya adalah menonton film.", answer: "わたし の しゅみ は えいが を みる こと です" },
    { question: "Hobi saya adalah mendengarkan musik.", answer: "わたし の しゅみ は おんがく を きく こと です" },
    { question: "Sebelum tidur, saya membaca buku.", answer: "ねる まえ に、 ほん を よみます" },
    { question: "Saya sudah tiba sebelum jam 9.", answer: "９じ まえ に、 つきました" },
    { question: "Sebelum makan, saya mencuci tangan.", answer: "ごはん を たべる まえ に、 て を あらいます" },
    { question: "Berapa meter kamu bisa berenang?", answer: "なんメートル およぐ こと が できます か" }
  ],
  "bab19": [
    { question: "Saya pernah pergi ke Hokkaido.", answer: "わたし は ほっかいどう へ いった こと が あります" },
    { question: "Apakah kamu pernah makan sushi?", answer: "すし を たべた こと が あります か" },
    { question: "Saya pernah naik kuda.", answer: "うま に のった こと が あります" },
    { question: "Pada hari libur, saya membersihkan kamar, mencuci baju, dan lainnya.", answer: "やすみ の ひ は、 へや を そうじ したり、 せんたく したり します" },
    { question: "Minggu lalu saya bermain tenis, menonton film, dll.", answer: "せんしゅう テニス を したり、 えいが を みたり しました" },
    { question: "Anak saya sudah menjadi mahasiswa.", answer: "こども は だいがくせい に なりました" },
    { question: "Cuacanya menjadi panas ya.", answer: "てんき が あつく なりました ね" },
    { question: "Bahasa Jepangnya menjadi pintar ya.", answer: "にほんご が じょうず に なりました ね" }
  ],
  "bab20": [
    { question: "Besok pergi ke Tokyo? (Bentuk biasa)", answer: "あした とうきょう へ いく？" },
    { question: "Ya, saya pergi.", answer: "うん、いく" },
    { question: "Buku itu bagus? (Bentuk biasa)", answer: "その ほん は いい？" },
    { question: "Tidak, tidak begitu bagus.", answer: "ううん、あまり よくない" },
    { question: "Apakah ada kamus? (Bentuk biasa)", answer: "じしょ、ある？" },
    { question: "Boleh pinjam payung? (Bentuk biasa)", answer: "かさ、かりても いい？" },
    { question: "Besok cuacanya akan cerah. (Bentuk biasa)", answer: "あした は いい てんき だ" },
    { question: "Tadi malam saya tidak tidur. (Bentuk biasa)", answer: "きのう の ばん、 ねなかった" }
  ],
  "bab21": [
    { question: "Saya pikir besok akan hujan.", answer: "あした は あめ が ふる と おもいます" },
    { question: "Sdr. Miller berkata akan pergi minggu depan.", answer: "ミラーさん は らいしゅう いく と いいました" },
    { question: "Saya rasa harga barang di Jepang mahal.", answer: "にほん の ぶっか は たかい と おもいます" },
    { question: "Apakah Anda setuju?", answer: "あなた も そう おもいます か" },
    { question: "Tadi sebelum makan, kamu bilang apa?", answer: "さっき たべる まえ に、 なん と いいました か" },
    { question: "Saya bilang 'Itadakimasu'.", answer: "「いただきます」 と いいました" },
    { question: "Saya pikir besok tidak akan sibuk.", answer: "あした は いそがしくない と おもいます" },
    { question: "Menurut Anda, Jepang itu bagaimana?", answer: "にほん は どう だ と おもいます か" }
  ],
  "bab22": [
    { question: "Ini adalah buku yang saya beli kemarin.", answer: "これ は わたし が きのう かった ほん です" },
    { question: "Orang yang memakai kacamata itu adalah Sdr. Tanaka.", answer: "めがね を かけて いる ひと は たなかさん です" },
    { question: "Orang yang membuat kue ini adalah ibu saya.", answer: "この ケーキ を つくった ひと は はは です" },
    { question: "Saya menyukai rumah yang ada tamannya.", answer: "わたし は にわ が ある うち が すき です" },
    { question: "Saya tidak punya waktu untuk belajar.", answer: "わたし は べんきょうする じかん が ありません" },
    { question: "Saya punya janji menonton film bersama teman.", answer: "ともだち と えいが を みる やくそく が あります" },
    { question: "Apakah kamu kenal orang yang bernyanyi tadi?", answer: "さっき うたを うたった ひと を しって います か" },
    { question: "Tas yang Sdr. Miller bawa itu bagus ya.", answer: "ミラーさん が もって いる かばん は いい です ね" }
  ],
  "bab23": [
    { question: "Saat pergi ke perpustakaan, saya meminjam buku.", answer: "としょかん へ いく とき、 ほん を かります" },
    { question: "Saat tidak mengerti cara penggunaannya, tolong tanya pada saya.", answer: "つかいかた が わからない とき、 わたし に きいて ください" },
    { question: "Saat saya anak-anak, saya tinggal di Amerika.", answer: "こども の とき、 アメリカ に すんで いました" },
    { question: "Saat sedih, kamu melakukan apa?", answer: "さびしい とき、 なに を します か" },
    { question: "Jika memutar tombol ini, suaranya akan membesar.", answer: "この つまみ を まわす と、 おと が おおきく なります" },
    { question: "Jika berjalan lurus, ada bank di sebelah kanan.", answer: "まっすぐ いく と、 みぎ に ぎんこう が あります" },
    { question: "Saat menyeberang jalan, tolong hati-hati.", answer: "みち を わたる とき、 き を つけて ください" },
    { question: "Mesin ini tidak akan bergerak jika kamu tidak menekan tombolnya.", answer: "ボタン を おさない と、 きかい は うごきません" }
  ],
  "bab24": [
    { question: "Ibu memberi saya kado.", answer: "はは は わたし に プレゼント を くれました" },
    { question: "Siapa yang membantumu?", answer: "だれ が てつだって くれました か" },
    { question: "Saya meminjamkan uang kepada teman.", answer: "わたし は ともだち に おかね を かして あげました" },
    { question: "Sdr. Yamada mengajari saya bahasa Jepang.", answer: "やまださん は わたし に にほんご を おしえて くれました" },
    { question: "Saya difotokan oleh Sdr. Karina.", answer: "わたし は カリナさん に しゃしん を とって もらいました" },
    { question: "Ayah membelikan saya sepeda.", answer: "ちち が わたし に じてんしゃ を かって くれました" },
    { question: "Ibu membuatkan bekal untuk Sdr. Miller.", answer: "はは は ミラーさん に おべんとう を つくって あげました" },
    { question: "Tolong beritahu cara bacanya.", answer: "よみかた を おしえて くれません か" }
  ],
  "bab25": [
    { question: "Jika hujan, saya tidak pergi.", answer: "あめ が ふったら、 いきません" },
    { question: "Jika uangnya ada, saya ingin membeli mobil.", answer: "おかね が あったら、 くるま を かいたい です" },
    { question: "Jika sudah sampai stasiun, tolong telepon saya.", answer: "えき に ついたら、 でんわ を して ください" },
    { question: "Walaupun murah, saya tidak akan beli.", answer: "やすくても、 かいません" },
    { question: "Walaupun hujan, saya tetap pergi.", answer: "あめ が ふっても、 いきます" },
    { question: "Walaupun memikirkan lama, saya tidak tahu jawabannya.", answer: "たくさん かんがえても、 わかりません" },
    { question: "Jika kamu sibuk besok, tidak usah datang juga tidak apa-apa.", answer: "あした いそがしかったら、 こなくても いい です よ" },
    { question: "Jika sudah jadi kakek-kakek, kamu mau hidup di mana?", answer: "おじいさん に なったら、 どこ に すみたい です か" }
  ]
};

async function main() {
  console.log('Membuat soal untuk bab-bab Minna no Nihongo...');
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Iterate over dataSoal
  for (const [babName, questions] of Object.entries(dataSoal)) {
    const filePath = path.join(outDir, `${babName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf-8');
    console.log(`✅ Digenerate: ${babName}.json (${questions.length} soal)`);
  }

  // Create empty files for bab that have no data yet (but user requested to generate up to 25)
  // Bab 1 and 16 are already excluded.
  const babLengkap = [];
  for (let i = 2; i <= 25; i++) {
    if (i === 16) continue; // sudah ada
    const babName = `bab${String(i).padStart(2, '0')}`;
    babLengkap.push(babName);
  }

  for (const babName of babLengkap) {
    const filePath = path.join(outDir, `${babName}.json`);
    if (!fs.existsSync(filePath)) {
      // Create empty array file
      fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
      console.log(`⚠️ Digenerate file kosong: ${babName}.json (karena belum ada data simulasi)`);
    }
  }

  console.log('\nSelesai men-generate file bab!');
}

main();
