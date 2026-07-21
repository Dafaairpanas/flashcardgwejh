const fs = require('fs');
const path = require('path');

const outDir = path.resolve('./public/soal');

const dataSoalPart1 = {
  "bab02": [
    { q: "Kunci ini milik siapa?", a: "この かぎ は だれ の です か" },
    { q: "Ini adalah majalah mobil.", a: "これ は くるま の ざっし です" },
    { q: "Apakah payung itu milik Sdr. Miller?", a: "その かさ は ミラーさん の です か" },
    { q: "Bukan, buku catatan ini bukan milik saya.", a: "いいえ、この ノート は わたし の じゃ ありません" },
    { q: "Kamus itu adalah milik saya.", a: "あの じしょ は わたし の です" },
    { q: "Apakah ini kartu Sdr. Tanaka?", a: "これ は たなかさん の カード です か" },
    { q: "Televisi itu buatan mana?", a: "その テレビ は どこ の です か" },
    { q: "Ini adalah CD bahasa Jepang.", a: "これ は にほんご の CD です" },
    { q: "Kamera ini bukan milik Sdr. Yamada.", a: "この カメラ は やまださん の じゃ ありません" },
    { q: "Meja itu milik siapa?", a: "あの つくえ は だれ の です か" },
    { q: "Apakah ini bolpoin atau pensil?", a: "これ は ボールペン です か、 えんぴつ です か" },
    { q: "Apakah ini majalah komputer? Bukan, bukan majalah komputer.", a: "これ は コンピューター の ざっし です か。いいえ、コンピューター の ざっし じゃ ありません" },
    { q: "Tas ini adalah milik saya.", a: "この かばん は わたし の です" },
    { q: "Sepatu itu adalah buatan Italia.", a: "その くつ は イタリア の です" },
    { q: "Itu (jauh) adalah kamus bahasa Inggris.", a: "あれ は えいご の じしょ です" },
    { q: "Kaset ini milik siapa?", a: "この カセットテープ は だれ の です か" },
    { q: "Itu (dekat kamu) adalah kunci mobil.", a: "それ は くるま の かぎ です" },
    { q: "Buku ini adalah buku Sdr. Santos.", a: "この ほん は サントスさん の ほん です" },
    { q: "Apakah itu (jauh) jam tangan?", a: "あれ は とけい です か" },
    { q: "Bukan, itu bukan jam tangan. Itu kacamata.", a: "いいえ、とけい じゃ ありません。めがね です" }
  ],
  "bab03": [
    { q: "Toilet ada di mana?", a: "トイレ は どこ です か" },
    { q: "Mesin penjual otomatis ada di sana (jauh).", a: "じどうはんばいき は あそこ です" },
    { q: "Kantin ada di lantai berapa?", a: "しょくどう は なんがい です か" },
    { q: "Kantin ada di lantai bawah tanah.", a: "しょくどう は ちか です" },
    { q: "Sepatu ini harganya berapa?", a: "この くつ は いくら です か" },
    { q: "Kamera ini harganya 25.800 yen.", a: "この カメラ は にまん ごせん はっぴゃく えん です" },
    { q: "Sdr. Miller ada di ruang rapat.", a: "ミラーさん は かいぎしつ です" },
    { q: "Dasi ini buatan Italia lho.", a: "この ネクタイ は イタリア の です よ" },
    { q: "Di manakah kantor?", a: "じむしょ は どちら です か" },
    { q: "Kantor ada di lantai tiga.", a: "じむしょ は さんがい です" },
    { q: "Tas ini buatan mana?", a: "この かばん は どこ の です か" },
    { q: "Itu adalah tas buatan Jepang.", a: "にほん の かばん です" },
    { q: "Ruang kelas ada di sebelah sini.", a: "きょうしつ は こちら です" },
    { q: "Lift ada di sebelah mana?", a: "エレベーター は どちら です か" },
    { q: "Kunci ini harganya 500 yen.", a: "この かぎ は ごひゃく えん です" },
    { q: "Telepon ada di lantai dua.", a: "でんわ は にかい です" },
    { q: "Anggur ini buatan Prancis.", a: "この ワイン は フランス の です" },
    { q: "Negara Sdr. Tanaka di mana?", a: "たなかさん の おくに は どちら です か" },
    { q: "Tangga ada di sebelah sana.", a: "かいだん は あちら です" },
    { q: "Sepeda ini harganya mahal.", a: "この じてんしゃ は たかい です" }
  ],
  "bab04": [
    { q: "Sekarang jam setengah sembilan.", a: "いま くじ はん です" },
    { q: "Bank buka dari jam 9 sampai jam 3.", a: "ぎんこう は ９じ から ３じ まで です" },
    { q: "Hari ini hari libur kantor.", a: "きょう は かいしゃ の やすみ です" },
    { q: "Besok saya bangun jam 6 pagi.", a: "あした わたし は あさ ６じ に おきます" },
    { q: "Kemarin malam saya tidak tidur.", a: "きのう の ばん わたし は ねません でした" },
    { q: "Setiap hari saya bekerja dari jam 8 sampai jam 5.", a: "まいにち ８じ から ５じ まで はたらきます" },
    { q: "Tadi malam saya tidur jam 11.", a: "きのう の ばん １１じ に ねました" },
    { q: "Hari apa perpustakaan tutup?", a: "としょかん は なんようび やすみ です か" },
    { q: "Hari ini hari Rabu.", a: "きょう は すいようび です" },
    { q: "Kemarin saya belajar dari jam 7 sampai jam 10.", a: "きのう ７じ から １０じ まで べんきょう しました" },
    { q: "Sekarang jam berapa di New York?", a: "いま ニューヨーク は なんじ です か" },
    { q: "Tadi pagi saya tidak bangun jam 7.", a: "けさ ７じ に おきません でした" },
    { q: "Minggu lalu saya beristirahat.", a: "せんしゅう わたし は やすみました" },
    { q: "Setiap hari sabtu saya bermain tenis.", a: "まいしゅう どようび に テニス を します" },
    { q: "Sdr. Miller bekerja hari ini.", a: "ミラーさん は きょう はたらきます" },
    { q: "Jam berapa Sdr. Yamada pulang?", a: "やまださん は なんじ に かえります か" },
    { q: "Ujiannya dari jam 1 sampai jam 3 siang.", a: "しけん は ごご １じ から ３じ まで です" },
    { q: "Tadi pagi saya bekerja sampai jam setengah sebelas.", a: "けさ １０じ はん まで はたらきました" },
    { q: "Saya tidur pada hari minggu.", a: "にちようび に ねます" },
    { q: "Apakah kamu belajar setiap hari?", a: "まいにち べんきょう します か" }
  ],
  "bab05": [
    { q: "Saya pergi ke Tokyo dengan kereta cepat (Shinkansen).", a: "わたし は しんかんせん で とうきょう へ いきます" },
    { q: "Besok saya datang ke rumah teman sendirian.", a: "あした ひとりで ともだち の うち へ きます" },
    { q: "Bulan lalu saya pulang ke kampung halaman dengan pesawat.", answer: "せんげつ ひこうき で くに へ かえりました" }, // typo fix in structure below
    { q: "Kemarin saya tidak pergi kemana-mana.", a: "きのう どこ も いきません でした" },
    { q: "Kapan Sdr. Miller datang ke Jepang?", a: "いつ ミラーさん は にほん へ きました か" },
    { q: "Saya pulang bersama keluarga.", a: "かぞく と かえります" },
    { q: "Ulang tahun saya adalah tanggal 5 Mei.", a: "わたし の たんじょうび は ５がつ いつか です" },
    { q: "Minggu depan saya pergi ke Kyoto dengan kereta biasa.", a: "らいしゅう でんしゃ で きょうと へ いきます" },
    { q: "Dengan siapa kamu pergi ke stasiun?", a: "だれ と えき へ いきます か" },
    { q: "Tahun lalu saya datang ke Jepang bulan Agustus.", a: "きょねん ８がつ に にほん へ きました" },
    { q: "Besok saya pergi ke supermarket berjalan kaki.", a: "あした あるいて スーパー へ いきます" },
    { q: "Hari libur saya pulang terlambat.", a: "やすみ の ひ おそく かえります" },
    { q: "Kapan kamu pulang ke rumah?", a: "いつ うち へ かえります か" },
    { q: "Hari ini saya akan pergi ke perusahaan.", a: "きょう わたし は かいしゃ へ いきます" },
    { q: "Saya tidak datang dengan bis.", a: "バス で きません でした" },
    { q: "Minggu lalu saya pergi ke pesta dengan taksi.", a: "せんしゅう タクシー で パーティー へ いきました" },
    { q: "Saya pergi sendiri dengan kereta bawah tanah.", a: "ひとりで ちかてつ で いきます" },
    { q: "Tahun depan, bulan 4 saya kembali ke negara asal.", a: "らいねん ４がつ に くに へ かえります" },
    { q: "Apakah besok kamu ke bank?", a: "あした ぎんこう へ いきます か" },
    { q: "Tidak, saya tidak ke mana-mana besok.", a: "いいえ、あした は どこ も いきません" }
  ],
  "bab06": [
    { q: "Saya makan roti dan telur setiap pagi.", a: "わたし は まいあさ パン と たまご を たべます" },
    { q: "Tadi malam saya tidak makan daging dan ikan.", a: "きのう の ばん にく と さかな を たべません でした" },
    { q: "Ayo kita pergi menonton film bersama besok.", a: "あした いっしょに えいが を み に いきましょう" },
    { q: "Maukah kamu minum bir bersamaku?", a: "いっしょに ビール を のみません か" },
    { q: "Pagi ini saya tidak makan apapun.", a: "けさ なにも たべません でした" },
    { q: "Di taman, saya mengambil foto bunga sakura.", a: "こうえん で さくら の しゃしん を とりました" },
    { q: "Saya menulis surat untuk teman di perpustakaan.", a: "としょかん で ともだち に てがみ を かきました" },
    { q: "Ayo kita bertemu jam 12 di depan stasiun.", a: "１２じ に えき の まえ で あいましょう" },
    { q: "Kemarin saya membaca majalah dan mendengarkan musik.", a: "きのう ざっし を よんで、 おんがく を ききました" },
    { q: "Apa yang kamu lakukan besok siang?", a: "あした の ごご なに を します か" },
    { q: "Maukah kita bermain tenis minggu depan?", a: "らいしゅう テニス を しません か" },
    { q: "Saya membeli sayuran di supermarket.", a: "スーパー で やさい を かいました" },
    { q: "Kemarin saya mengerjakan PR di rumah.", a: "きのう うち で しゅくだい を しました" },
    { q: "Tadi pagi saya membaca koran sambil minum kopi.", a: "けさ コーヒー を のみながら しんぶん を よみました" }, // sedikit upper level untuk menambah kesukaran
    { q: "Bagus ya. Ayo lakukan.", a: "いい です ね。そう しましょう" },
    { q: "Kamu minum minuman seperti apa?", a: "どんな のみもの を のみます か" },
    { q: "Setiap hari saya merokok.", a: "まいにち たばこ を すいます" },
    { q: "Saya tidak mendengarkan CD hari ini.", a: "きょう ＣＤ を ききません" },
    { q: "Maukah minum teh di kedai kopi?", a: "きっさてん で おちゃ を のみません か" },
    { q: "Saya makan buah setiap malam.", a: "まいばん くだもの を たべます" }
  ],
  "bab07": [
    { q: "Saya menulis laporan menggunakan komputer pribadi (PC).", a: "パソコン で レポート を かきました" },
    { q: "Saya mengirim hadiah menggunakan pos udara.", a: "こうくうびん で プレゼント を おくりました" },
    { q: "Terima kasih banyak dalam bahasa Inggris adalah 'Thank you'.", a: "ありがとう ございます は えいご で 「Thank you」 です" },
    { q: "Saya meminjamkan penghapus kepada Sdr. Miller.", a: "ミラーさん に けしゴム を かしました" },
    { q: "Saya belajar bahasa Inggris dari Guru.", a: "せんせい に えいご を ならいました" },
    { q: "Saya menelepon keluarga di Jepang.", a: "にほん の かぞく に でんわ を かけました" },
    { q: "Apakah kamu sudah membeli tiket shinkansen?", a: "もう しんかんせん の きっぷ を かいました か" },
    { q: "Belum, saya akan membelinya nanti.", a: "いいえ、まだ です。これから かいます" },
    { q: "Saya memotong kertas menggunakan gunting.", a: "はさみ で かみ を きります" },
    { q: "Saya memberi bunga kepada pacar.", a: "こいびと に はな を あげました" },
    { q: "Saya menerima uang dari ayah.", a: "ちち に おかね を もらいました" },
    { q: "Apakah kamu sudah mengirimkan bagasi?", a: "もう にもつ を おくりました か" },
    { q: "Dengan apa kamu makan mie?", a: "なん で ラーメン を たべます か" },
    { q: "Saya makan dengan sumpit dan sendok.", a: "はし と スプーン で たべます" },
    { q: "Kapan kamu memberikan kado ulang tahun?", a: "いつ たんじょうび の プレゼント を あげます か" },
    { q: "Besok saya mengajari Sdr. Yamada bahasa Spanyol.", a: "あした やまださん に スペインご を おしえます" },
    { q: "Saya meminjam buku dari perpustakaan.", a: "としょかん で ほん を かりました" },
    { q: "Sudahkah kamu menulis email ke perusahaan?", a: "もう かいしゃ に メール を かきました か" },
    { q: "Saya memperbaiki sepeda menggunakan obeng.", a: "ドライバー で じてんしゃ を なおします" },
    { q: "Apa yang kamu terima saat ulang tahun?", a: "たんじょうび に なに を もらいました か" }
  ],
  "bab08": [
    { q: "Bunga sakura sangat indah dan terkenal.", a: "さくら は とても きれいで ゆうめい です" },
    { q: "Gunung Fuji tinggi tapi tidak sepi.", a: "ふじさん は たかい です が、しずか じゃ ありません" },
    { q: "Makanan di restoran itu enak tapi mahal.", a: "あの レストラン の たべもの は おいしい です が、たかい です" },
    { q: "Kota Tokyo adalah kota yang sibuk dan meriah.", a: "とうきょう は いそがしくて にぎやかな まち です" },
    { q: "Tugas bahasa Jepang hari ini cukup sulit.", a: "きょう の にほんご の しゅくだい は かなり むずかしい です" },
    { q: "Kamar Sdr. Tanaka luas dan bersih.", a: "たなかさん の へや は ひろくて きれい です" },
    { q: "Kehidupan di Jepang bagaimana? Sangat menyenangkan lho.", a: "にほん の せいかつ は どう です か。とても たのしい です よ" },
    { q: "Film itu sama sekali tidak menarik.", a: "あの えいが は ぜんぜん おもしろくない です" },
    { q: "Cuaca hari ini tidak begitu bagus ya.", a: "きょう の てんき は あまり よくない です ね" },
    { q: "Kereta bawah tanah sangat praktis lho.", a: "ちかてつ は とても べんり です よ" },
    { q: "Apakah pekerjaanmu sibuk? Ya, setiap hari sibuk.", a: "しごと は いそがしい です か。はい、まいにち いそがしい です" },
    { q: "Sdr. Maria adalah orang yang baik hati.", a: "マリアさん は しんせつな ひと です" },
    { q: "Tas Sdr. Santos yang mana? Yang merah itu.", a: "サントスさん の かばん は どれ です か。あの あかい の です" },
    { q: "Ini adalah teh yang terkenal dari Inggris.", a: "これ は イギリス の ゆうめいな おちゃ です" },
    { q: "Buku itu bagus tapi harganya sangat mahal.", a: "あの ほん は いい です が、とても たかい です" },
    { q: "Bunga ini tidak indah sama sekali.", a: "この はな は ぜんぜん きれい じゃ ありません" },
    { q: "Sekolah saya tidak baru dan tidak besar.", a: "わたし の がっこう は あたらしくないし、おおきくない です" }, // upper level mix
    { q: "Kota ini tidak sepi dan airnya tidak enak.", a: "この まち は しずか じゃ ないし、 みず は おいしくない です" },
    { q: "Apakah mobil ini praktis? Tidak, tidak praktis.", a: "この くるま は べんり です か。いいえ、べんり じゃ ありません" },
    { q: "Sdr. Watt adalah guru yang terkenal lho.", a: "ワットさん は ゆうめいな せんせい です よ" }
  ]
};

// Pastikan properti tetap `question` dan `answer`
for (let bab in dataSoalPart1) {
  dataSoalPart1[bab] = dataSoalPart1[bab].map(obj => ({
    question: obj.q || obj.question,
    answer: obj.a || obj.answer
  }));
}

fs.writeFileSync(path.join(outDir, 'bab_part1_temp.json'), JSON.stringify(dataSoalPart1, null, 2));
console.log('Part 1 saved locally for processing later.');
