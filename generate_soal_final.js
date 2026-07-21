import fs from 'fs';
import path from 'path';
const outDir = path.resolve('./public/soal');
const dataSoal = {
  "bab02": [
    {
      "question": "Kunci ini milik siapa?",
      "answer": "この かぎ は だれ の です か"
    },
    {
      "question": "Ini adalah majalah mobil.",
      "answer": "これ は くるま の ざっし です"
    },
    {
      "question": "Apakah payung itu milik Sdr. Miller?",
      "answer": "その かさ は ミラーさん の です か"
    },
    {
      "question": "Bukan, buku catatan ini bukan milik saya.",
      "answer": "いいえ、この ノート は わたし の じゃ ありません"
    },
    {
      "question": "Kamus itu adalah milik saya.",
      "answer": "あの じしょ は わたし の です"
    },
    {
      "question": "Apakah ini kartu Sdr. Tanaka?",
      "answer": "これ は たなかさん の カード です か"
    },
    {
      "question": "Televisi itu buatan mana?",
      "answer": "その テレビ は どこ の です か"
    },
    {
      "question": "Ini adalah CD bahasa Jepang.",
      "answer": "これ は にほんご の CD です"
    },
    {
      "question": "Kamera ini bukan milik Sdr. Yamada.",
      "answer": "この カメラ は やまださん の じゃ ありません"
    },
    {
      "question": "Meja itu milik siapa?",
      "answer": "あの つくえ は だれ の です か"
    },
    {
      "question": "Apakah ini bolpoin atau pensil?",
      "answer": "これ は ボールペン です か、 えんぴつ です か"
    },
    {
      "question": "Apakah ini majalah komputer? Bukan, bukan majalah komputer.",
      "answer": "これ は コンピューター の ざっし です か。いいえ、コンピューター の ざっし じゃ ありません"
    },
    {
      "question": "Tas ini adalah milik saya.",
      "answer": "この かばん は わたし の です"
    },
    {
      "question": "Sepatu itu adalah buatan Italia.",
      "answer": "その くつ は イタリア の です"
    },
    {
      "question": "Itu (jauh) adalah kamus bahasa Inggris.",
      "answer": "あれ は えいご の じしょ です"
    },
    {
      "question": "Kaset ini milik siapa?",
      "answer": "この カセットテープ は だれ の です か"
    },
    {
      "question": "Itu (dekat kamu) adalah kunci mobil.",
      "answer": "それ は くるま の かぎ です"
    },
    {
      "question": "Buku ini adalah buku Sdr. Santos.",
      "answer": "この ほん は サントスさん の ほん です"
    },
    {
      "question": "Apakah itu (jauh) jam tangan?",
      "answer": "あれ は とけい です か"
    },
    {
      "question": "Bukan, itu bukan jam tangan. Itu kacamata.",
      "answer": "いいえ、とけい じゃ ありません。めがね です"
    }
  ],
  "bab03": [
    {
      "question": "Toilet ada di mana?",
      "answer": "トイレ は どこ です か"
    },
    {
      "question": "Mesin penjual otomatis ada di sana (jauh).",
      "answer": "じどうはんばいき は あそこ です"
    },
    {
      "question": "Kantin ada di lantai berapa?",
      "answer": "しょくどう は なんがい です か"
    },
    {
      "question": "Kantin ada di lantai bawah tanah.",
      "answer": "しょくどう は ちか です"
    },
    {
      "question": "Sepatu ini harganya berapa?",
      "answer": "この くつ は いくら です か"
    },
    {
      "question": "Kamera ini harganya 25.800 yen.",
      "answer": "この カメラ は にまん ごせん はっぴゃく えん です"
    },
    {
      "question": "Sdr. Miller ada di ruang rapat.",
      "answer": "ミラーさん は かいぎしつ です"
    },
    {
      "question": "Dasi ini buatan Italia lho.",
      "answer": "この ネクタイ は イタリア の です よ"
    },
    {
      "question": "Di manakah kantor?",
      "answer": "じむしょ は どちら です か"
    },
    {
      "question": "Kantor ada di lantai tiga.",
      "answer": "じむしょ は さんがい です"
    },
    {
      "question": "Tas ini buatan mana?",
      "answer": "この かばん は どこ の です か"
    },
    {
      "question": "Itu adalah tas buatan Jepang.",
      "answer": "にほん の かばん です"
    },
    {
      "question": "Ruang kelas ada di sebelah sini.",
      "answer": "きょうしつ は こちら です"
    },
    {
      "question": "Lift ada di sebelah mana?",
      "answer": "エレベーター は どちら です か"
    },
    {
      "question": "Kunci ini harganya 500 yen.",
      "answer": "この かぎ は ごひゃく えん です"
    },
    {
      "question": "Telepon ada di lantai dua.",
      "answer": "でんわ は にかい です"
    },
    {
      "question": "Anggur ini buatan Prancis.",
      "answer": "この ワイン は フランス の です"
    },
    {
      "question": "Negara Sdr. Tanaka di mana?",
      "answer": "たなかさん の おくに は どちら です か"
    },
    {
      "question": "Tangga ada di sebelah sana.",
      "answer": "かいだん は あちら です"
    },
    {
      "question": "Sepeda ini harganya mahal.",
      "answer": "この じてんしゃ は たかい です"
    }
  ],
  "bab04": [
    {
      "question": "Sekarang jam setengah sembilan.",
      "answer": "いま くじ はん です"
    },
    {
      "question": "Bank buka dari jam 9 sampai jam 3.",
      "answer": "ぎんこう は ９じ から ３じ まで です"
    },
    {
      "question": "Hari ini hari libur kantor.",
      "answer": "きょう は かいしゃ の やすみ です"
    },
    {
      "question": "Besok saya bangun jam 6 pagi.",
      "answer": "あした わたし は あさ ６じ に おきます"
    },
    {
      "question": "Kemarin malam saya tidak tidur.",
      "answer": "きのう の ばん わたし は ねません でした"
    },
    {
      "question": "Setiap hari saya bekerja dari jam 8 sampai jam 5.",
      "answer": "まいにち ８じ から ５じ まで はたらきます"
    },
    {
      "question": "Tadi malam saya tidur jam 11.",
      "answer": "きのう の ばん １１じ に ねました"
    },
    {
      "question": "Hari apa perpustakaan tutup?",
      "answer": "としょかん は なんようび やすみ です か"
    },
    {
      "question": "Hari ini hari Rabu.",
      "answer": "きょう は すいようび です"
    },
    {
      "question": "Kemarin saya belajar dari jam 7 sampai jam 10.",
      "answer": "きのう ７じ から １０じ まで べんきょう しました"
    },
    {
      "question": "Sekarang jam berapa di New York?",
      "answer": "いま ニューヨーク は なんじ です か"
    },
    {
      "question": "Tadi pagi saya tidak bangun jam 7.",
      "answer": "けさ ７じ に おきません でした"
    },
    {
      "question": "Minggu lalu saya beristirahat.",
      "answer": "せんしゅう わたし は やすみました"
    },
    {
      "question": "Setiap hari sabtu saya bermain tenis.",
      "answer": "まいしゅう どようび に テニス を します"
    },
    {
      "question": "Sdr. Miller bekerja hari ini.",
      "answer": "ミラーさん は きょう はたらきます"
    },
    {
      "question": "Jam berapa Sdr. Yamada pulang?",
      "answer": "やまださん は なんじ に かえります か"
    },
    {
      "question": "Ujiannya dari jam 1 sampai jam 3 siang.",
      "answer": "しけん は ごご １じ から ３じ まで です"
    },
    {
      "question": "Tadi pagi saya bekerja sampai jam setengah sebelas.",
      "answer": "けさ １０じ はん まで はたらきました"
    },
    {
      "question": "Saya tidur pada hari minggu.",
      "answer": "にちようび に ねます"
    },
    {
      "question": "Apakah kamu belajar setiap hari?",
      "answer": "まいにち べんきょう します か"
    }
  ],
  "bab05": [
    {
      "question": "Saya pergi ke Tokyo dengan kereta cepat (Shinkansen).",
      "answer": "わたし は しんかんせん で とうきょう へ いきます"
    },
    {
      "question": "Besok saya datang ke rumah teman sendirian.",
      "answer": "あした ひとりで ともだち の うち へ きます"
    },
    {
      "question": "Bulan lalu saya pulang ke kampung halaman dengan pesawat.",
      "answer": "せんげつ ひこうき で くに へ かえりました"
    },
    {
      "question": "Kemarin saya tidak pergi kemana-mana.",
      "answer": "きのう どこ も いきません でした"
    },
    {
      "question": "Kapan Sdr. Miller datang ke Jepang?",
      "answer": "いつ ミラーさん は にほん へ きました か"
    },
    {
      "question": "Saya pulang bersama keluarga.",
      "answer": "かぞく と かえります"
    },
    {
      "question": "Ulang tahun saya adalah tanggal 5 Mei.",
      "answer": "わたし の たんじょうび は ５がつ いつか です"
    },
    {
      "question": "Minggu depan saya pergi ke Kyoto dengan kereta biasa.",
      "answer": "らいしゅう でんしゃ で きょうと へ いきます"
    },
    {
      "question": "Dengan siapa kamu pergi ke stasiun?",
      "answer": "だれ と えき へ いきます か"
    },
    {
      "question": "Tahun lalu saya datang ke Jepang bulan Agustus.",
      "answer": "きょねん ８がつ に にほん へ きました"
    },
    {
      "question": "Besok saya pergi ke supermarket berjalan kaki.",
      "answer": "あした あるいて スーパー へ いきます"
    },
    {
      "question": "Hari libur saya pulang terlambat.",
      "answer": "やすみ の ひ おそく かえります"
    },
    {
      "question": "Kapan kamu pulang ke rumah?",
      "answer": "いつ うち へ かえります か"
    },
    {
      "question": "Hari ini saya akan pergi ke perusahaan.",
      "answer": "きょう わたし は かいしゃ へ いきます"
    },
    {
      "question": "Saya tidak datang dengan bis.",
      "answer": "バス で きません でした"
    },
    {
      "question": "Minggu lalu saya pergi ke pesta dengan taksi.",
      "answer": "せんしゅう タクシー で パーティー へ いきました"
    },
    {
      "question": "Saya pergi sendiri dengan kereta bawah tanah.",
      "answer": "ひとりで ちかてつ で いきます"
    },
    {
      "question": "Tahun depan, bulan 4 saya kembali ke negara asal.",
      "answer": "らいねん ４がつ に くに へ かえります"
    },
    {
      "question": "Apakah besok kamu ke bank?",
      "answer": "あした ぎんこう へ いきます か"
    },
    {
      "question": "Tidak, saya tidak ke mana-mana besok.",
      "answer": "いいえ、あした は どこ も いきません"
    }
  ],
  "bab06": [
    {
      "question": "Saya makan roti dan telur setiap pagi.",
      "answer": "わたし は まいあさ パン と たまご を たべます"
    },
    {
      "question": "Tadi malam saya tidak makan daging dan ikan.",
      "answer": "きのう の ばん にく と さかな を たべません でした"
    },
    {
      "question": "Ayo kita pergi menonton film bersama besok.",
      "answer": "あした いっしょに えいが を み に いきましょう"
    },
    {
      "question": "Maukah kamu minum bir bersamaku?",
      "answer": "いっしょに ビール を のみません か"
    },
    {
      "question": "Pagi ini saya tidak makan apapun.",
      "answer": "けさ なにも たべません でした"
    },
    {
      "question": "Di taman, saya mengambil foto bunga sakura.",
      "answer": "こうえん で さくら の しゃしん を とりました"
    },
    {
      "question": "Saya menulis surat untuk teman di perpustakaan.",
      "answer": "としょかん で ともだち に てがみ を かきました"
    },
    {
      "question": "Ayo kita bertemu jam 12 di depan stasiun.",
      "answer": "１２じ に えき の まえ で あいましょう"
    },
    {
      "question": "Kemarin saya membaca majalah dan mendengarkan musik.",
      "answer": "きのう ざっし を よんで、 おんがく を ききました"
    },
    {
      "question": "Apa yang kamu lakukan besok siang?",
      "answer": "あした の ごご なに を します か"
    },
    {
      "question": "Maukah kita bermain tenis minggu depan?",
      "answer": "らいしゅう テニス を しません か"
    },
    {
      "question": "Saya membeli sayuran di supermarket.",
      "answer": "スーパー で やさい を かいました"
    },
    {
      "question": "Kemarin saya mengerjakan PR di rumah.",
      "answer": "きのう うち で しゅくだい を しました"
    },
    {
      "question": "Tadi pagi saya membaca koran sambil minum kopi.",
      "answer": "けさ コーヒー を のみながら しんぶん を よみました"
    },
    {
      "question": "Bagus ya. Ayo lakukan.",
      "answer": "いい です ね。そう しましょう"
    },
    {
      "question": "Kamu minum minuman seperti apa?",
      "answer": "どんな のみもの を のみます か"
    },
    {
      "question": "Setiap hari saya merokok.",
      "answer": "まいにち たばこ を すいます"
    },
    {
      "question": "Saya tidak mendengarkan CD hari ini.",
      "answer": "きょう ＣＤ を ききません"
    },
    {
      "question": "Maukah minum teh di kedai kopi?",
      "answer": "きっさてん で おちゃ を のみません か"
    },
    {
      "question": "Saya makan buah setiap malam.",
      "answer": "まいばん くだもの を たべます"
    }
  ],
  "bab07": [
    {
      "question": "Saya menulis laporan menggunakan komputer pribadi (PC).",
      "answer": "パソコン で レポート を かきました"
    },
    {
      "question": "Saya mengirim hadiah menggunakan pos udara.",
      "answer": "こうくうびん で プレゼント を おくりました"
    },
    {
      "question": "Terima kasih banyak dalam bahasa Inggris adalah 'Thank you'.",
      "answer": "ありがとう ございます は えいご で 「Thank you」 です"
    },
    {
      "question": "Saya meminjamkan penghapus kepada Sdr. Miller.",
      "answer": "ミラーさん に けしゴム を かしました"
    },
    {
      "question": "Saya belajar bahasa Inggris dari Guru.",
      "answer": "せんせい に えいご を ならいました"
    },
    {
      "question": "Saya menelepon keluarga di Jepang.",
      "answer": "にほん の かぞく に でんわ を かけました"
    },
    {
      "question": "Apakah kamu sudah membeli tiket shinkansen?",
      "answer": "もう しんかんせん の きっぷ を かいました か"
    },
    {
      "question": "Belum, saya akan membelinya nanti.",
      "answer": "いいえ、まだ です。これから かいます"
    },
    {
      "question": "Saya memotong kertas menggunakan gunting.",
      "answer": "はさみ で かみ を きります"
    },
    {
      "question": "Saya memberi bunga kepada pacar.",
      "answer": "こいびと に はな を あげました"
    },
    {
      "question": "Saya menerima uang dari ayah.",
      "answer": "ちち に おかね を もらいました"
    },
    {
      "question": "Apakah kamu sudah mengirimkan bagasi?",
      "answer": "もう にもつ を おくりました か"
    },
    {
      "question": "Dengan apa kamu makan mie?",
      "answer": "なん で ラーメン を たべます か"
    },
    {
      "question": "Saya makan dengan sumpit dan sendok.",
      "answer": "はし と スプーン で たべます"
    },
    {
      "question": "Kapan kamu memberikan kado ulang tahun?",
      "answer": "いつ たんじょうび の プレゼント を あげます か"
    },
    {
      "question": "Besok saya mengajari Sdr. Yamada bahasa Spanyol.",
      "answer": "あした やまださん に スペインご を おしえます"
    },
    {
      "question": "Saya meminjam buku dari perpustakaan.",
      "answer": "としょかん で ほん を かりました"
    },
    {
      "question": "Sudahkah kamu menulis email ke perusahaan?",
      "answer": "もう かいしゃ に メール を かきました か"
    },
    {
      "question": "Saya memperbaiki sepeda menggunakan obeng.",
      "answer": "ドライバー で じてんしゃ を なおします"
    },
    {
      "question": "Apa yang kamu terima saat ulang tahun?",
      "answer": "たんじょうび に なに を もらいました か"
    }
  ],
  "bab08": [
    {
      "question": "Bunga sakura sangat indah dan terkenal.",
      "answer": "さくら は とても きれいで ゆうめい です"
    },
    {
      "question": "Gunung Fuji tinggi tapi tidak sepi.",
      "answer": "ふじさん は たかい です が、しずか じゃ ありません"
    },
    {
      "question": "Makanan di restoran itu enak tapi mahal.",
      "answer": "あの レストラン の たべもの は おいしい です が、たかい です"
    },
    {
      "question": "Kota Tokyo adalah kota yang sibuk dan meriah.",
      "answer": "とうきょう は いそがしくて にぎやかな まち です"
    },
    {
      "question": "Tugas bahasa Jepang hari ini cukup sulit.",
      "answer": "きょう の にほんご の しゅくだい は かなり むずかしい です"
    },
    {
      "question": "Kamar Sdr. Tanaka luas dan bersih.",
      "answer": "たなかさん の へや は ひろくて きれい です"
    },
    {
      "question": "Kehidupan di Jepang bagaimana? Sangat menyenangkan lho.",
      "answer": "にほん の せいかつ は どう です か。とても たのしい です よ"
    },
    {
      "question": "Film itu sama sekali tidak menarik.",
      "answer": "あの えいが は ぜんぜん おもしろくない です"
    },
    {
      "question": "Cuaca hari ini tidak begitu bagus ya.",
      "answer": "きょう の てんき は あまり よくない です ね"
    },
    {
      "question": "Kereta bawah tanah sangat praktis lho.",
      "answer": "ちかてつ は とても べんり です よ"
    },
    {
      "question": "Apakah pekerjaanmu sibuk? Ya, setiap hari sibuk.",
      "answer": "しごと は いそがしい です か。はい、まいにち いそがしい です"
    },
    {
      "question": "Sdr. Maria adalah orang yang baik hati.",
      "answer": "マリアさん は しんせつな ひと です"
    },
    {
      "question": "Tas Sdr. Santos yang mana? Yang merah itu.",
      "answer": "サントスさん の かばん は どれ です か。あの あかい の です"
    },
    {
      "question": "Ini adalah teh yang terkenal dari Inggris.",
      "answer": "これ は イギリス の ゆうめいな おちゃ です"
    },
    {
      "question": "Buku itu bagus tapi harganya sangat mahal.",
      "answer": "あの ほん は いい です が、とても たかい です"
    },
    {
      "question": "Bunga ini tidak indah sama sekali.",
      "answer": "この はな は ぜんぜん きれい じゃ ありません"
    },
    {
      "question": "Sekolah saya tidak baru dan tidak besar.",
      "answer": "わたし の がっこう は あたらしくないし、おおきくない です"
    },
    {
      "question": "Kota ini tidak sepi dan airnya tidak enak.",
      "answer": "この まち は しずか じゃ ないし、 みず は おいしくない です"
    },
    {
      "question": "Apakah mobil ini praktis? Tidak, tidak praktis.",
      "answer": "この くるま は べんり です か。いいえ、べんり じゃ ありません"
    },
    {
      "question": "Sdr. Watt adalah guru yang terkenal lho.",
      "answer": "ワットさん は ゆうめいな せんせい です よ"
    }
  ],
  "bab09": [
    {
      "question": "Saya suka masakan Italia dan sering memakannya.",
      "answer": "わたし は イタリアりょうり が すき で、 よく たべます"
    },
    {
      "question": "Karena anak saya benci sayuran, dia sama sekali tidak makan.",
      "answer": "こども は やさい が きらい です から、 ぜんぜん たべません"
    },
    {
      "question": "Sdr. Miller pandai bernyanyi dan menari lho.",
      "answer": "ミラーさん は うた と ダンス が じょうず です よ"
    },
    {
      "question": "Saya tidak begitu pandai bahasa Inggris, tapi mengerti bahasa Jepang sedikit.",
      "answer": "わたし は えいご が あまり じょうず じゃ ありません が、 にほんご が すこし わかります"
    },
    {
      "question": "Saya tidak mengerti bahasa Prancis sama sekali.",
      "answer": "フランスご が ぜんぜん わかりません"
    },
    {
      "question": "Karena besok sibuk, saya tidak akan pergi ke pesta.",
      "answer": "あした いそがしい です から、 パーティー へ いきません"
    },
    {
      "question": "Apakah kamu punya banyak uang dan waktu?",
      "answer": "おかね と じかん が たくさん あります か"
    },
    {
      "question": "Saya ada janji menonton film hari ini.",
      "answer": "きょう えいが を みる やくそく が あります"
    },
    {
      "question": "Istri saya pandai memasak, tapi benci bersih-bersih.",
      "answer": "つま は りょうり が じょうず です が、 そうじ が きらい です"
    },
    {
      "question": "Kenapa kamu membaca koran setiap pagi?",
      "answer": "どうして まいあさ しんぶん を よみます か"
    },
    {
      "question": "Karena saya menyukai berita dan ingin belajar.",
      "answer": "ニュース が すき です から、 そして べんきょう したい です から"
    },
    {
      "question": "Apakah ada keperluan minggu depan?",
      "answer": "らいしゅう ようじ が あります か"
    },
    {
      "question": "Kamera ini murah dan bagus, makanya saya beli.",
      "answer": "この カメラ は やすくて いい です から、 かいました"
    },
    {
      "question": "Suami saya tidak punya hobi dan sering sakit.",
      "answer": "おっと は しゅみ が ありません し、 よく びょうき に なります"
    },
    {
      "question": "Apakah kamu suka minum bir? Tidak, saya benci.",
      "answer": "ビール を のむ の が すき です か。いいえ、きらい です"
    },
    {
      "question": "Karena tidak punya uang, saya tidak membeli kamera.",
      "answer": "おかね が ありません から、 カメラ を かいません でした"
    },
    {
      "question": "Bunga ini cantik tapi mahal ya.",
      "answer": "この はな は きれい です が、たかい です ね"
    },
    {
      "question": "Apa olahraga yang kamu paling sukai?",
      "answer": "スポーツ で なに が いちばん すき です か"
    },
    {
      "question": "Sdr. Yamada pandai olahraga tapi saya tidak pandai.",
      "answer": "やまださん は スポーツ が じょうず です が、 わたし は へた です"
    },
    {
      "question": "Kenapa kamu pulang cepat? Karena sakit.",
      "answer": "どうして はやく かえります か。びょうき です から"
    }
  ],
  "bab10": [
    {
      "question": "Di taman ada banyak pohon dan bunga yang indah.",
      "answer": "こうえん に き と きれいな はな が たくさん あります"
    },
    {
      "question": "Di bawah meja ada kucing dan anjing tidur.",
      "answer": "つくえ の した に ねこ と いぬ が います"
    },
    {
      "question": "Di antara gedung bank dan supermarket ada toko buku.",
      "answer": "ぎんこう と スーパー の あいだ に ほんや が あります"
    },
    {
      "question": "Tolong ambilkan buku yang ada di atas laci.",
      "answer": "ひきだし の うえ に ある ほん を とって ください"
    },
    {
      "question": "Di dalam kotak ini ada apa saja?",
      "answer": "この はこ の なか に なに が あります か"
    },
    {
      "question": "Ada jam tangan antik, kacamata, dan lain-lain.",
      "answer": "ふるい とけい や めがね など が あります"
    },
    {
      "question": "Sdr. Tanaka sedang berada di dalam ruang rapat.",
      "answer": "たなかさん は かいぎしつ の なか に います"
    },
    {
      "question": "Di dekat stasiun ada kedai kopi yang enak dan murah.",
      "answer": "えき の ちかく に おいしくて やすい きっさてん が あります"
    },
    {
      "question": "Tempat pensil ada di mana? Ada di sebelah kanan kamus.",
      "answer": "ふでばこ は どこ に あります か。じしょ の みぎ に あります"
    },
    {
      "question": "Di luar jendela terlihat burung terbang.",
      "answer": "まど の そと に とり が います"
    },
    {
      "question": "Apakah di lobi ada siapa-siapa?",
      "answer": "ロビー に だれか います か"
    },
    {
      "question": "Tidak, tidak ada siapa-siapa sama sekali.",
      "answer": "いいえ、だれも いません"
    },
    {
      "question": "Rumah sakit ada di sebelah kantor pos.",
      "answer": "びょういん は ゆうびんきょく の となり に あります"
    },
    {
      "question": "Saya menunggu di belakang mesin tiket.",
      "answer": "けんばいき の うしろ で まちます"
    },
    {
      "question": "Di kulkas tidak ada apapun.",
      "answer": "れいぞうこ の なか に なにも ありません"
    },
    {
      "question": "Kucing putih itu ada di pojok ruangan.",
      "answer": "あの しろい ねこ は へや の すみ に います"
    },
    {
      "question": "Anak laki-laki ada di depan pintu masuk.",
      "answer": "おとこのこ は ドア の まえ に います"
    },
    {
      "question": "Di kamar tidur ada kasur, meja, rak buku, dsb.",
      "answer": "しんしつ に ベッド や つくえ や ほんだな など が あります"
    },
    {
      "question": "Toko Sdr. Yamada ada di mana?",
      "answer": "やまださん の みせ は どこ に あります か"
    },
    {
      "question": "Ada di bawah jembatan itu.",
      "answer": "あの はし の した に あります"
    }
  ],
  "bab11": [
    {
      "question": "Saya ingin membeli tiga buah jeruk dan dua buah apel.",
      "answer": "みかん を みっつ と りんご を ふたつ かいたい です"
    },
    {
      "question": "Di meja ada lima lembar kertas, tolong ambilkan.",
      "answer": "つくえ に かみ が ごまい あります、とって ください"
    },
    {
      "question": "Di garasi ada 4 unit mobil buatan Jerman.",
      "answer": "車庫 に ドイツ の くるま が よんだい あります"
    },
    {
      "question": "Saya sudah belajar bahasa Jepang selama kurang lebih setengah tahun.",
      "answer": "わたし は はんとし ぐらい にほんご を べんきょう しました"
    },
    {
      "question": "Dari rumah ke universitas memakan waktu sekitar satu jam setengah.",
      "answer": "うち から だいがく まで いちじかん はん ぐらい かかります"
    },
    {
      "question": "Dalam seminggu, saya berolahraga sebanyak 3 kali.",
      "answer": "いっしゅうかん に さんかい スポーツ を します"
    },
    {
      "question": "Keluarga saya ada 6 orang, termasuk saya.",
      "answer": "わたし の かぞく は わたし を いれて ろくにん います"
    },
    {
      "question": "Tolong berikan tiket masuk ini sebanyak 8 lembar.",
      "answer": "この きっぷ を はちまい ください"
    },
    {
      "question": "Hanya butuh 5 menit berjalan kaki ke stasiun lho.",
      "answer": "えき まで あるいて ごふん しか かかりません よ"
    },
    {
      "question": "Berapa banyak kemeja putih yang kamu punya?",
      "answer": "しろい シャツ が なんまい あります か"
    },
    {
      "question": "Saya memesan dua porsi kari dan tiga buah roti.",
      "answer": "カレー を ふたつ と パン を みっつ ちゅうもん します"
    },
    {
      "question": "Sdr. Miller mempunyai dua orang anak laki-laki.",
      "answer": "ミラーさん は おとこのこ が ふたり います"
    },
    {
      "question": "Di taman ada berapa ekor anjing?",
      "answer": "こうえん に いぬ が なんびき います か"
    },
    {
      "question": "Dalam setahun kamu libur panjang berapa kali?",
      "answer": "いちねん に なんかい ながい やすみ を とります か"
    },
    {
      "question": "Saya pergi jalan-jalan bersama tiga orang teman.",
      "answer": "ともだち さんにん と さんぽ し に いきました"
    },
    {
      "question": "Saya makan sandwich satu saja tadi pagi.",
      "answer": "けさ サンドイッチ を ひとつ だけ たべました"
    },
    {
      "question": "Pengiriman barang ke Tokyo butuh berapa hari?",
      "answer": "とうきょう まで にもつ は なんにち かかります か"
    },
    {
      "question": "Dua hari saja sudah cukup.",
      "answer": "ふつか だけで いい です"
    },
    {
      "question": "Di kelas bahasa Jepang ada 10 mahasiswa asing.",
      "answer": "にほんご の クラス に りゅうがくせい が じゅうにん います"
    },
    {
      "question": "Kirim surat ini tolong bayar prangko 3 lembar.",
      "answer": "この てがみ を おくる に きって が さんまい いります"
    }
  ],
  "bab12": [
    {
      "question": "Ujian minggu lalu tidak begitu sulit, tapi panjang.",
      "answer": "せんしゅう の しけん は あまり むずかしくない でした が、 ながかった です"
    },
    {
      "question": "Kemarin cuacanya hujan lebat, jadi sangat dingin.",
      "answer": "きのう は おおあめ でした から、 とても さむかった です"
    },
    {
      "question": "Taman bermain di sana tidak terlalu ramai kemarin lusa.",
      "answer": "おととい、 あそこ の ゆうえんち は あまり にぎやか じゃ ありません でした"
    },
    {
      "question": "Pesawat lebih cepat daripada kapal, tetapi mahal.",
      "answer": "ひこうき は ふね より はやい です が、 たかい です"
    },
    {
      "question": "Di antara Tokyo dan Kyoto, kamu lebih suka tinggal di mana?",
      "answer": "とうきょう と きょうと と どちら が すみたい です か"
    },
    {
      "question": "Saya lebih suka di Kyoto, karena lebih tenang.",
      "answer": "きょうと の ほう が すき です。しずか です から"
    },
    {
      "question": "Di seluruh dunia, negara apa yang paling kamu sukai?",
      "answer": "せかい で どの くに が いちばん すき です か"
    },
    {
      "question": "Tentu saja negara sendiri yang paling indah.",
      "answer": "もちろん じぶん の くに が いちばん きれい だ と おもいます"
    },
    {
      "question": "Hotel tempat menginap kemarin kamarnya kecil dan tidak bagus.",
      "answer": "きのう の ホテル は へや が ちいさくて、 よくない でした"
    },
    {
      "question": "Film itu seru sekali! Dibandingkan film lain, ini yang terbaik.",
      "answer": "あの えいが は とても おもしろかった です！ ほか の より いちばん いい です"
    },
    {
      "question": "Dulu rambut saya panjang, tapi sekarang pendek.",
      "answer": "むかし わたし の かみ は ながかった です が、 いま は みじかい です"
    },
    {
      "question": "Kamera ini lebih ringan daripada kamus itu.",
      "answer": "この カメラ は あの じしょ より かるい です"
    },
    {
      "question": "Di antara musim, musim gugur adalah yang paling sejuk.",
      "answer": "きせつ で あき が いちばん すずしい です"
    },
    {
      "question": "Tas merek ini harganya mahal dan dulu berat sekali.",
      "answer": "この かばん は たかくて、 むかし は とても おもかった です"
    },
    {
      "question": "Apakah liburan panjang menyenangkan? Tidak, membosankan.",
      "answer": "ながい やすみ は たのしかった です か。いいえ、つまらない でした"
    },
    {
      "question": "Restoran kemarin pelayanannya buruk.",
      "answer": "きのう の レストラン は サービス が わるい でした"
    },
    {
      "question": "Makan di luar lebih mahal daripada makan di rumah.",
      "answer": "そと で たべる ほう が うち で たべる より たかい です"
    },
    {
      "question": "Pesta kemarin siapa yang paling sibuk?",
      "answer": "きのう の パーティー は だれ が いちばん いそがしかった です か"
    },
    {
      "question": "Ibu yang paling sibuk memasak masakan.",
      "answer": "はは が りょうり で いちばん いそがしかった です"
    },
    {
      "question": "Pemandangan dari sini luar biasa indah ya kemarin.",
      "answer": "きのう ここ から の けしき は すばらしく きれい でした ね"
    }
  ],
  "bab13": [
    {
      "question": "Setelah mendapat gaji, saya paling menginginkan komputer canggih.",
      "answer": "きゅうりょう を もらってから、 いい コンピューター が いちばん ほしい です"
    },
    {
      "question": "Karena hari ini panas, saya ingin makan es krim yang dingin.",
      "answer": "きょう は あつい です から、 つめたい アイスクリーム が たべたい です"
    },
    {
      "question": "Saat sedang lelah, saya tidak ingin melakukan apapun sama sekali.",
      "answer": "つかれた とき、 なにも したくない です"
    },
    {
      "question": "Besok saya pergi ke bandara untuk menjemput orang tua.",
      "answer": "あした わたし は くうこう へ りょうしん を むかえ に いきます"
    },
    {
      "question": "Teman saya datang ke Jepang untuk belajar ekonomi di universitas.",
      "answer": "ともだち は にほん へ だいがく で けいざい を べんきょう し に きました"
    },
    {
      "question": "Anak saya benci sayur, jadi dia tidak ingin memakannya.",
      "answer": "こども は やさい が きらい です から、 たべたくない です"
    },
    {
      "question": "Kamu paling ingin bertemu dengan siapa sekarang?",
      "answer": "いま だれ に いちばん あいたい です か"
    },
    {
      "question": "Saya masuk ke warung kopi itu untuk meminum teh hangat.",
      "answer": "あの きっさてん へ あたたかい おちゃ を のみ に はいりました"
    },
    {
      "question": "Sabtu depan, ayo kita pergi berbelanja di Ginza bersama.",
      "answer": "らいしゅう の どようび、 いっしょに ぎんざ へ かいもの に いきましょう"
    },
    {
      "question": "Saya mengundang teman ke rumah untuk bermain game bersama.",
      "answer": "ともだち を うち へ ゲーム を し に よびました"
    },
    {
      "question": "Kamu tidak lelah? Ingin beristirahat sebentar?",
      "answer": "つかれない です か。すこし やすみたい です か"
    },
    {
      "question": "Hari ini perut saya sakit, jadi tidak mau makan apapun.",
      "answer": "きょう は おなか が いたい です から、 なにも たべたくない です"
    },
    {
      "question": "Istri saya menginginkan tas baru yang mahal itu.",
      "answer": "つま は あの たかい あたらしい かばん を ほしがって います"
    },
    {
      "question": "Musim panas tahun depan, saya ingin pergi ke laut untuk berenang.",
      "answer": "らいねん の なつ、 うみ へ およぎ に いきたい です"
    },
    {
      "question": "Karena sudah lapar, saya mau mampir ke sana untuk makan ramen.",
      "answer": "おなか が すきました から、 あそこ へ ラーメン を たべ に よりたい です"
    },
    {
      "question": "Kamu haus? Ingin minum bir dingin?",
      "answer": "のど が かわきました か。つめたい ビール を のみたい です か"
    },
    {
      "question": "Bulan lalu saya kembali ke negara asal untuk menikah.",
      "answer": "せんげつ くに へ けっこん し に かえりました"
    },
    {
      "question": "Waktu luang kamu biasanya apa yang paling kamu inginkan?",
      "answer": "ひまな とき なに が いちばん ほしい です か"
    },
    {
      "question": "Saya cuma menginginkan ketenangan dan tidur.",
      "answer": "しずか な じかん と すいみん だけ が ほしい です"
    },
    {
      "question": "Guru datang ke perpustakaan untuk membaca buku sejarah.",
      "answer": "せんせい は としょかん へ れきし の ほん を よみ に きました"
    }
  ],
  "bab14": [
    {
      "question": "Karena sangat panas, tolong nyalakan AC sekarang.",
      "answer": "とても あつい です から、 いま エアコン を つけて ください"
    },
    {
      "question": "Jangan cepat-cepat! Tolong tunggu sebentar di sini.",
      "answer": "いそがないで！ ここ で ちょっと まって ください"
    },
    {
      "question": "Sdr. Miller sedang mengobrol dengan presiden direktur di ruang rapat.",
      "answer": "ミラーさん は かいぎしつ で しゃちょう と はなして います"
    },
    {
      "question": "Karena hujan mulai turun lebat, mari saya panggilkan taksi.",
      "answer": "あめ が おおきく ふって います から、 タクシー を よびましょう か"
    },
    {
      "question": "Bolehkah saya membawakan dua tas besar milik Anda ini?",
      "answer": "この あなた の おおきな かばん を ふたつ もちましょう か"
    },
    {
      "question": "Maaf, tolong pelankan suara radionya sedikit.",
      "answer": "すみません、 ラジオ の おと を もう すこし ちいさく して ください"
    },
    {
      "question": "Tolong buka pintu itu lebar-lebar karena udara gerah.",
      "answer": "むしあつい です から、 あの ドア を おおきく あけて ください"
    },
    {
      "question": "Sekarang kakak perempuan saya sedang membuat kue di dapur.",
      "answer": "いま あね は だいどころ で ケーキ を つくって います"
    },
    {
      "question": "Lihatlah ke sana! Ada burung yang sangat indah lho.",
      "answer": "あそこ を みて ください！ とても きれいな とり が います よ"
    },
    {
      "question": "Tolong belok ke kanan di perempatan lampu merah itu.",
      "answer": "あの しんごう の こうさてん を みぎ へ まがって ください"
    },
    {
      "question": "Di stasiun ini, tolong perlihatkan tiket kepada petugas.",
      "answer": "この えき で、 えきいん に きっぷ を みせて ください"
    },
    {
      "question": "Hati-hati ya saat menyeberang jalan ini.",
      "answer": "この みち を わたる とき、 き を つけて ください"
    },
    {
      "question": "Kakak laki-laki sedang berdiri membaca koran di lobi.",
      "answer": "あに は ロビー で たって しんぶん を よんで います"
    },
    {
      "question": "Waktu tidak cukup, jadi tolong cepat panggil taksi.",
      "answer": "じかん が ありません から、 はやく タクシー を よんで ください"
    },
    {
      "question": "Salju sedang turun dengan sangat lebat di luar.",
      "answer": "そと で ゆき が とても おおく ふって います"
    },
    {
      "question": "Mari saya pinjamkan payung ini kepadamu.",
      "answer": "あなた に この かさ を かしましょう か"
    },
    {
      "question": "Tolong tulis nama lengkapmu menggunakan huruf kanji.",
      "answer": "なまえ を ぜんぶ かんじ で かいて ください"
    },
    {
      "question": "Mohon ingat kosakata bahasa Jepang sebelum ujian.",
      "answer": "しけん の まえ に、 にほんご の ことば を おぼえて ください"
    },
    {
      "question": "Guru sedang menerangkan tata bahasa kepada siswa di kelas.",
      "answer": "せんせい は きょうしつ で がくせい に ぶんぽう を おしえて います"
    },
    {
      "question": "Aku mau mematikan TV, apakah kamu sedang menontonnya?",
      "answer": "テレビ を けしましょう か。いま みて います か"
    }
  ],
  "bab15": [
    {
      "question": "Bolehkah saya mengambil foto di dalam kuil ini? Tidak, tidak boleh.",
      "answer": "この おてら の なか で しゃしん を とって も いい です か。いいえ、とって は いけません"
    },
    {
      "question": "Di pameran ini, tolong jangan menyentuh barang buatan luar negeri.",
      "answer": "この てんらんかい で、 がいこく の けんぶつ に さわって は いけません"
    },
    {
      "question": "Bolehkah saya membawa pulang katalog ini ke rumah?",
      "answer": "この カタログ を うち へ もって かえって も いい です か"
    },
    {
      "question": "Apakah kamu kenal orang yang berdiri menggunakan kacamata hitam itu?",
      "answer": "あの くろい めがね を かけて たって いる ひと を しって います か"
    },
    {
      "question": "Kakak saya tinggal di Osaka dan bekerja memproduksi mobil.",
      "answer": "あに は おおさか に すんで いて、 くるま を つくって います"
    },
    {
      "question": "Ponsel saya rusak, bolehkah saya meminjam telepon di sini?",
      "answer": "わたし の けいたい が こわれました、ここ の でんわ を つかって も いい です か"
    },
    {
      "question": "Di perpustakaan dilarang makan dan minum dengan ribut.",
      "answer": "としょかん で は うるさく のんで たべて は いけません"
    },
    {
      "question": "Sdr. Miller tahu nomor telepon perusahaan taksi itu tidak?",
      "answer": "ミラーさん は あの タクシー かいしゃ の でんわばんごう を しって います か"
    },
    {
      "question": "Bolehkah saya menghisap rokok di bangku dekat jendela ini?",
      "answer": "まど の ちかく の ベンチ で たばこ を すって も いい です か"
    },
    {
      "question": "Mobil Sdr. Suzuki sangat unik, dia membelinya 10 tahun lalu lho.",
      "answer": "すずきさん の くるま は ユニーク で、 １０ねん まえ に かって もちました よ"
    },
    {
      "question": "Dilarang memarkir mobil di depan rumah sakit ini.",
      "answer": "この びょういん の まえ に くるま を とめて は いけません"
    },
    {
      "question": "Karena di luar hujan lebat, bolehkah tutup jendelanya?",
      "answer": "そと は おおあめ です から、 まど を しめて も いい です か"
    },
    {
      "question": "Di museum dilarang menggunakan lampu kilat kamera.",
      "answer": "はくぶつかん で カメラ の フラッシュ を つかって は いけません"
    },
    {
      "question": "Ayah saya menjual perangkat lunak komputer di Tokyo.",
      "answer": "ちち は とうきょう で コンピューター の ソフト を うって います"
    },
    {
      "question": "Saya tidak tahu jam berapa rapat akan dimulai hari ini.",
      "answer": "きょう の かいぎ が なんじ に はじまる か しりません"
    },
    {
      "question": "Guru sedang memegang kapur tulis di depan kelas.",
      "answer": "せんせい は きょうしつ の まえ で チョーク を もって います"
    },
    {
      "question": "Bolehkah saya masuk ruangan sekarang? Tolong tunggu di luar.",
      "answer": "いま へや へ はいって も いい です か。そと で まって ください"
    },
    {
      "question": "Menikah dengan warga asing adalah hal yang menarik.",
      "answer": "がいこくじん と けっこん して いる の は おもしろい です"
    },
    {
      "question": "Dilarang membuang sampah sembarangan di sungai ini.",
      "answer": "この かわ に ごみ を すてて は いけません"
    },
    {
      "question": "Bolehkah meminjam kamus Sdr. Kimura sebentar saja?",
      "answer": "きむらさん の じしょ を ちょっと かりて も いい です か"
    }
  ],
  "bab17": [
    {
      "question": "Tolong jangan merokok di ruangan ini karena ada anak-anak.",
      "answer": "こども が います から、この へや で たばこ を すわないで ください"
    },
    {
      "question": "Saya harus minum obat karena sakit flu berat.",
      "answer": "ひどい かぜ です から、くすり を のまなければ なりません"
    },
    {
      "question": "Besok tidak perlu membawa payung karena cuaca cerah.",
      "answer": "あした は はれ です から、 かさ を もって こなくても いい です"
    },
    {
      "question": "Paspor ini jangan sampai hilang ya, ini sangat penting.",
      "answer": "この パスポート を なくさないで ください ね、たいせつ です から"
    },
    {
      "question": "Setiap hari harus menghafal 20 kosa kata kanji Jepang.",
      "answer": "まいにち にほんご の かんじ の ことば を ２０ おぼえなければ なりません"
    },
    {
      "question": "Tolong jangan lupa mengembalikan buku perpustakaan besok.",
      "answer": "あした としょかん の ほん を かえす の を わすれないで ください"
    },
    {
      "question": "Karena sudah malam, kamu harus cepat tidur.",
      "answer": "もう よる です から、 はやく ねなければ なりません"
    },
    {
      "question": "Pakaian tebal tidak perlu dipakai karena hari ini panas.",
      "answer": "きょう は あつい です から、 あつい ふく を きなくても いい です"
    },
    {
      "question": "Jangan membuang sampah sembarangan di stasiun ini.",
      "answer": "この えき で ごみ を すてないで ください"
    },
    {
      "question": "Kamu harus membayar uang masuk sebelum jam 5 sore.",
      "answer": "ごご ５じ まで に おかね を はらわなければ なりません"
    },
    {
      "question": "Saya tidak perlu pergi ke kantor sakit karena sudah sembuh.",
      "answer": "もう びょうき が よくなりまし から、 びょういん へ いかなくても いい です"
    },
    {
      "question": "Dokumen ini tolong jangan diperlihatkan kepada orang lain.",
      "answer": "この しりょう は ほか の ひと に みせないで ください"
    },
    {
      "question": "Setiap pagi saya harus lari pagi demi kesehatan.",
      "answer": "からだ の ため に、 まいあさ ジョギング しなければ なりません"
    },
    {
      "question": "Tidak perlu khawatir, ujiannya mudah kok.",
      "answer": "しけん は かんたん です から、 しんぱい しなくても いい です よ"
    },
    {
      "question": "Jangan mengambil foto memakai flash di museum seni.",
      "answer": "びじゅつかん で フラッシュ を つかって しゃしん を とらないで ください"
    },
    {
      "question": "Saya harus segera berangkat sekarang agar tidak telat.",
      "answer": "おそく ならない ように、 いま すぐ でかけなければ なりません"
    },
    {
      "question": "Baju ini tidak usah dicuci hari ini.",
      "answer": "この ふく は きょう せんたく しなくても いい です"
    },
    {
      "question": "Sabtu depan harus bekerja lembur sampai malam.",
      "answer": "らいしゅう の どようび よる まで ざんぎょう しなければ なりません"
    },
    {
      "question": "Tolong jangan buka jendela lebar-lebar karena anginnya dingin.",
      "answer": "かぜ が さむい です から、 まど を おおきく あけないで ください"
    },
    {
      "question": "Uang kembaliannya jangan lupa diambil.",
      "answer": "おつり を とる の を わすれないで ください"
    }
  ],
  "bab18": [
    {
      "question": "Apakah kamu bisa menyanyikan lagu bahasa Jepang dengan baik?",
      "answer": "にほんご の うた を じょうずに うたう こと が できます か"
    },
    {
      "question": "Saya bisa berbicara bahasa Inggris sedikit-sedikit.",
      "answer": "わたし は えいご を すこし はなす こと が できます"
    },
    {
      "question": "Hobi saya adalah mengoleksi foto tua dari seluruh dunia.",
      "answer": "わたし の しゅみ は せかい の ふるい しゃしん を あつめる こと です"
    },
    {
      "question": "Hobi ayah saya adalah memancing di sungai setiap minggu.",
      "answer": "ちち の しゅみ は まいしゅう かわ で つり を する こと です"
    },
    {
      "question": "Sebelum makan malam, tolong cuci tanganmu bersih-bersih.",
      "answer": "ばんごはん を たべる まえ に、 きれいに て を あらって ください"
    },
    {
      "question": "Tiga tahun yang lalu, sebelum datang ke Jepang, saya menikah.",
      "answer": "さんねん まえ に、 にほん へ くる まえ に けっこん しました"
    },
    {
      "question": "Apakah di hotel ini bisa memakai kartu kredit asing?",
      "answer": "この ホテル で がいこく の クレジットカード を つかう こと が できます か"
    },
    {
      "question": "Sebelum tidur saya selalu berdoa dan membaca buku.",
      "answer": "ねる まえ に いつも おいのり して、 ほん を よみます"
    },
    {
      "question": "Meskipun hobi saya berenang, saya tidak bisa berenang di laut.",
      "answer": "しゅみ は およぐ こと です が、 うみ で およぐ こと は できません"
    },
    {
      "question": "Di bank ini kamu bisa menukar uang dolar menjadi yen.",
      "answer": "この ぎんこう で ドル を えん に かえる こと が できます"
    },
    {
      "question": "Sebelum berolahraga, tolong lakukan pemanasan.",
      "answer": "スポーツ を する まえ に、 じゅんび たいそう を して ください"
    },
    {
      "question": "Sdr. Maria bisa membuat kue yang rasanya sangat enak lho.",
      "answer": "マリアさん は とても おいしい ケーキ を つくる こと が できます よ"
    },
    {
      "question": "Apakah kamu bisa mengemudikan mobil sport?",
      "answer": "スポーツカー を うんてん する こと が できます か"
    },
    {
      "question": "Sebelum rapat dimulai, tolong fotokopi dokumen ini 20 lembar.",
      "answer": "かいぎ が はじまる まえ に、 この しりょう を ２０まい コピー して ください"
    },
    {
      "question": "Hobi kamu mendengarkan musik genre apa?",
      "answer": "しゅみ は どんな おんがく を きく こと です か"
    },
    {
      "question": "Jepang punya banyak tempat di mana kita bisa melihat salju.",
      "answer": "にほん に ゆき を みる こと が できる ところ が たくさん あります"
    },
    {
      "question": "Lima hari sebelum ujian, saya jatuh sakit parah.",
      "answer": "しけん の いつか まえ に、 ひどい びょうき に なりました"
    },
    {
      "question": "Saya tidak bisa mengetik dengan cepat di komputer ini.",
      "answer": "わたし は この コンピューター で はやく タイプ する こと が できません"
    },
    {
      "question": "Saya suka belajar bahasa Jepang lewat menonton anime.",
      "answer": "アニメ を みる こと で にほんご を べんきょう する の が すき です"
    },
    {
      "question": "Penyanyi favorit saya akan datang ke sini 1 jam lagi (sebelum 1 jam berlalu).",
      "answer": "いちじかん まえ に すきな かしゅ が ここ へ きます"
    }
  ],
  "bab19": [
    {
      "question": "Saya pernah memanjat Gunung Fuji tiga kali saat musim dingin.",
      "answer": "ふゆ に ふじさん に さんかい のぼった こと が あります"
    },
    {
      "question": "Apakah kamu pernah makan makanan khas Korea yang pedas?",
      "answer": "からい かんこくりょうり を たべた こと が あります か"
    },
    {
      "question": "Saya tidak pernah berkuda sama sekali seumur hidup.",
      "answer": "わたし は ぜんぜん うま に のった こと が ありません"
    },
    {
      "question": "Pada hari libur panjang, saya membersihkan kamar, mencuci baju, dan lainnya.",
      "answer": "ながい やすみ の ひ は、 へや を そうじ したり、 せんたく したり します"
    },
    {
      "question": "Minggu lalu saya berbelanja, menonton film, dll. Sangat sibuk.",
      "answer": "せんしゅう かいもの を したり、 えいが を みたり して、とても いそがしかった です"
    },
    {
      "question": "Anak teman saya menjadi mahasiswa yang pintar tahun ini.",
      "answer": "ともだち の こども は ことし あたま が いい だいがくせい に なりました"
    },
    {
      "question": "Cuacanya pelan-pelan menjadi dingin ya di bulan November.",
      "answer": "１１がつ に てんき が だんだん さむく なりました ね"
    },
    {
      "question": "Sdr. Miller menjadi makin pandai berbicara menggunakan bahasa Jepang lho.",
      "answer": "ミラーさん は にほんご を はなす の が じょうずに なりました よ"
    },
    {
      "question": "Tadi malam saya minum bir, bernyanyi, dan lainnya di karaoke.",
      "answer": "きのう の ばん カラオケ で ビール を のんだり、 うた を うたったり しました"
    },
    {
      "question": "Di taman, orang-orang duduk-duduk, berjalan santai, dsb.",
      "answer": "こうえん で ひとびと は すわったり、 さんぽ したり して います"
    },
    {
      "question": "Saya pernah ketiduran di kereta dan terlewat stasiun.",
      "answer": "でんしゃ で ねて しまって、 えき を すぎた こと が あります"
    },
    {
      "question": "Karena banyak latihan, saya jadi pintar bermain tenis.",
      "answer": "たくさん れんしゅう しました から、 テニス が じょうずに なりました"
    },
    {
      "question": "Meskipun pernah ke Tokyo, saya tidak pernah melihat menara Tokyo.",
      "answer": "とうきょう へ いった こと が あります が、 とうきょうタワー を みた こと が ありません"
    },
    {
      "question": "Dulu saya gendut, tapi sekarang menjadi kurus.",
      "answer": "むかし わたし は ふとって いました が、 いま ほそく なりました"
    },
    {
      "question": "Besok saya berencana membaca buku, menulis surat, dll.",
      "answer": "あした ほん を よんだり、 てがみ を かいたり したい です"
    },
    {
      "question": "Apakah ayahmu pernah ke luar negeri?",
      "answer": "おとうさん は がいこく へ いった こと が あります か"
    },
    {
      "question": "Ya, beliau pernah ke Amerika sekali waktu masih muda.",
      "answer": "はい、わかい とき いっかい アメリカ へ いった こと が あります"
    },
    {
      "question": "Malam ini bintangnya terlihat jelas ya, menjadi cerah.",
      "answer": "こんや ほし が よく みえます ね、 あかるく なりました"
    },
    {
      "question": "Saya menjadi umur 20 tahun pada bulan depan.",
      "answer": "らいげつ わたし は ２０さい に なります"
    },
    {
      "question": "Hari minggu saya sering bermain golf, tidur siang, dll.",
      "answer": "にちようび は よく ゴルフ を したり、 ひるね を したり します"
    }
  ],
  "bab20": [
    {
      "question": "Besok pergi ke Tokyo? (Biasa)",
      "answer": "あした とうきょう へ いく？"
    },
    {
      "question": "Tadi malam tidur jam berapa? (Biasa)",
      "answer": "きのう の ばん なんじ に ねた？"
    },
    {
      "question": "Tas yang kamu beli itu mahal? (Biasa)",
      "answer": "かった かばん は たかい？"
    },
    {
      "question": "Tidak, tas ini tidak mahal kok. (Biasa)",
      "answer": "ううん、この かばん は たかくない"
    },
    {
      "question": "Boleh pinjam penghapusmu sebentar? (Biasa)",
      "answer": "けしゴム、 ちょっと かりても いい？"
    },
    {
      "question": "Pesta kemarin sepi, jadi bosan. (Biasa)",
      "answer": "きのう の パーティー は しずかだった から、つまらなかった"
    },
    {
      "question": "Apakah kamus elektronik ini praktis? (Biasa)",
      "answer": "この でんしじしょ、 べんり？"
    },
    {
      "question": "Ya, sangat praktis dan murah. (Biasa)",
      "answer": "うん、すごく べんりで やすい よ"
    },
    {
      "question": "Kamu mau makan malam bersama hari jumat? (Biasa)",
      "answer": "きんようび に いっしょに ばんごはん を たべる？"
    },
    {
      "question": "Maaf, hari jumat saya ada janji, jadi tidak bisa. (Biasa)",
      "answer": "ごめん、きんようび は やくそく が ある から、 だめ だ"
    },
    {
      "question": "Ujian bulan lalu susah sekali kan? (Biasa)",
      "answer": "せんげつ の しけん、 すごく むずかしかった ね？"
    },
    {
      "question": "Tidak, ujiannya tidak begitu susah. (Biasa)",
      "answer": "ううん、あまり むずかしくなかった"
    },
    {
      "question": "Apakah punya uang receh 1000 yen? (Biasa)",
      "answer": "せんえん の こまかい おかね、 ある？"
    },
    {
      "question": "Tidak, saya sama sekali tidak punya uang. (Biasa)",
      "answer": "ううん、ぜんぜん おかね が ない"
    },
    {
      "question": "Apakah kamu pernah melihat salju turun? (Biasa)",
      "answer": "ゆき が ふる の を みた こと ある？"
    },
    {
      "question": "Tadi siang makan kari pedas di restoran. (Biasa)",
      "answer": "ひる レストラン で からい カレー を たべた"
    },
    {
      "question": "Kamu tahu restoran yang enak di dekat sini? (Biasa)",
      "answer": "この ちかく で おいしい レストラン を しってる？"
    },
    {
      "question": "Cuaca besok sepertinya tidak hujan. (Biasa)",
      "answer": "あした の てんき は あめ じゃ ない"
    },
    {
      "question": "Orang yang memakai topi merah itu siapa? (Biasa)",
      "answer": "あの あかい ぼうし を かぶって いる ひと は だれ？"
    },
    {
      "question": "Belum tidur? Padahal sudah jam 1 pagi lho. (Biasa)",
      "answer": "まだ ねて いない？ もう ごぜん １じ だ よ"
    }
  ],
  "bab21": [
    {
      "question": "Saya pikir besok cuacanya akan bagus sekali.",
      "answer": "あした は いい てんき だ と おもいます"
    },
    {
      "question": "Pak Presiden Direktur berkata akan pergi ke Amerika minggu depan.",
      "answer": "しゃちょう は らいしゅう アメリカ へ いく と いいました"
    },
    {
      "question": "Saya rasa harga elektronik di Jepang sangat mahal.",
      "answer": "にほん の でんしせいひん は とても たかい と おもいます"
    },
    {
      "question": "Apakah Anda juga setuju tentang pendapat ini?",
      "answer": "あなた も この いけん について そう おもいます か"
    },
    {
      "question": "Tadi sebelum presentasi, manajer bilang apa?",
      "answer": "さっき プレゼンテーション の まえ に、 ぶちょう は なん と いいました か"
    },
    {
      "question": "Manajer bilang 'Kerjakan dengan semangat'.",
      "answer": "「がんばって ください」 と いいました"
    },
    {
      "question": "Saya pikir ujian JLPT N4 tidak terlalu sulit jika banyak belajar.",
      "answer": "たくさん べんきょう したら、 ＪＬＰＴのＮ４の しけん は あまり むずかしくない と おもいます"
    },
    {
      "question": "Menurut Sdr. Karina, Jepang itu tempat yang bagaimana?",
      "answer": "カリナさん は にほん は どんな ところ だ と おもいます か"
    },
    {
      "question": "Sdr. Miller sepertinya tidak akan datang ke rapat sore ini.",
      "answer": "ごご の かいぎ に ミラーさん は こない と おもいます"
    },
    {
      "question": "Tolong katakan pada Sdr. Kimura supaya menelepon nanti.",
      "answer": "あとで でんわ する ように きむらさん に いって ください"
    },
    {
      "question": "Sebelum makan orang Jepang selalu bilang 'Itadakimasu'.",
      "answer": "たべる まえ に にほんじん は いつも 「いただきます」 と いいます"
    },
    {
      "question": "Saya tidak berpikir bahwa dia adalah pencuri.",
      "answer": "かれ が どろぼう だ と は おもいません"
    },
    {
      "question": "Orang itu berkata bahwa tasnya hilang di stasiun.",
      "answer": "あの ひと は えき で かばん が なくなった と いいました"
    },
    {
      "question": "Pemerintah mengumumkan bahwa pajak akan naik tahun depan.",
      "answer": "せいふ は らいねん ぜいきん が あがる と いいました"
    },
    {
      "question": "Saya kira mesin ATM ini rusak, ternyata tidak.",
      "answer": "この ＡＴＭ は こしょう だ と おもいました が、 そう じゃ なかったです"
    },
    {
      "question": "Sdr. Tanaka bilang akan membelikan mobil baru untuk ibunya.",
      "answer": "たなかさん は はは に あたらしい くるま を かって あげる と いいました"
    },
    {
      "question": "Semua orang menganggap festival itu menyenangkan.",
      "answer": "みんな あの おまつり は たのしい と おもって います"
    },
    {
      "question": "Kudengar kamu bilang mau pergi memancing minggu depan.",
      "answer": "らいしゅう つり に いく と いいました よ ね"
    },
    {
      "question": "Kamu pikir harga tiket pesawat ini berapa? Saya pikir 50.000 yen.",
      "answer": "この ひこうき の きっぷ は いくら だ と おもいます か。ごまんえん だ と おもいます"
    },
    {
      "question": "Jangan bilang kalau kamu lupa membawa dompet!",
      "answer": "さいふ を もって くる の を わすれた と いわないで ください！"
    }
  ],
  "bab22": [
    {
      "question": "Ini adalah tas merah yang saya beli dengan mahal kemarin.",
      "answer": "これ は わたし が きのう たかく かった あかい かばん です"
    },
    {
      "question": "Pria tinggi yang sedang membaca koran itu adalah ayah saya.",
      "answer": "あの しんぶん を よんで いる せ が たかい おとこのひと は わたし の ちち です"
    },
    {
      "question": "Orang yang pandai membuat masakan Spanyol ini adalah Sdr. Maria.",
      "answer": "この スペインりょうり を じょうずに つくった ひと は マリアさん です"
    },
    {
      "question": "Saya menyukai apartemen besar yang ada taman dan garasinya.",
      "answer": "わたし は にわ と しゃこ が ある おおきな アパート が すき です"
    },
    {
      "question": "Sayangnya, saya tidak punya waktu luang untuk menonton TV.",
      "answer": "ざんねん です が、 わたし は テレビ を みる ひまな じかん が ありません"
    },
    {
      "question": "Minggu ini ada janji untuk makan siang bersama manajer.",
      "answer": "こんしゅう ぶちょう と ひるごはん を たべる やくそく が あります"
    },
    {
      "question": "Apakah kamu kenal orang yang bernyanyi sambil main gitar tadi?",
      "answer": "さっき ギター を ひきながら うた を うたった ひと を しって います か"
    },
    {
      "question": "Kamus yang dipinjam Sdr. Miller dari perpustakaan sangat tebal.",
      "answer": "ミラーさん が としょかん から かりた じしょ は とても あつい です"
    },
    {
      "question": "Saya lahir di kota yang dingin dan banyak saljunya.",
      "answer": "わたし は さむくて ゆき が おおい まち で うまれました"
    },
    {
      "question": "Orang yang rambutnya pendek dan memakai kacamata hitam itu siapa?",
      "answer": "かみ が みじかくて くろい めがね を かけて いる ひと は だれ です か"
    },
    {
      "question": "Apakah ada alat yang bisa membersihkan kamar secara otomatis?",
      "answer": "じどう で へや を そうじ する きかい が あります か"
    },
    {
      "question": "Topi rajut yang nenek berikan kepadaku ini sangat hangat.",
      "answer": "おばあさん が わたし に くれた この ニット の ぼうし は とても あたたかい です"
    },
    {
      "question": "Hari Jumat saya tidak ada urusan pergi ke kantor cabang.",
      "answer": "きんようび は ししゃ へ いく ようじ が ありません"
    },
    {
      "question": "Sdr. Yamada sedang mencari kunci yang hilang di taman.",
      "answer": "やまださん は こうえん で なくなった かぎ を さがして います"
    },
    {
      "question": "Tempat favorit saya adalah restoran yang dekat dengan laut.",
      "answer": "わたし が いちばん すきな ところ は うみ の ちかく に ある レストラン です"
    },
    {
      "question": "Mobil buatan Jepang yang paling banyak terjual ada di garasi itu.",
      "answer": "いちばん よく うれた にほん の くるま は あの しゃこ に あります"
    },
    {
      "question": "Saya tidak ingat kata-kata yang diucapkan guru saat rapat kemarin.",
      "answer": "きのう の かいぎ で せんせい が いった ことば を おぼえて いません"
    },
    {
      "question": "Orang yang bekerja setiap hari sampai jam 10 malam itu kasihan.",
      "answer": "まいにち よる １０じ まで はたらく ひと は かわいそう です"
    },
    {
      "question": "Pemandangan gunung yang dilihat dari kereta sangat indah.",
      "answer": "でんしゃ から みる やま の けしき は とても きれい です"
    },
    {
      "question": "Apakah buku bahasa Inggris yang kamu baca menarik?",
      "answer": "あなた が よんで いる えいご の ほん は おもしろい です か"
    }
  ],
  "bab23": [
    {
      "question": "Saat sedang belajar, tolong jangan menyalakan radio keras-keras.",
      "answer": "べんきょう して いる とき、 ラジオ を おおきく つけないで ください"
    },
    {
      "question": "Saat tidak tahu jalan pulang, bertanyalah kepada petugas polisi.",
      "answer": "かえる みち が わからない とき、 けいかん に きいて ください"
    },
    {
      "question": "Saat saya masih pelajar, saya rajin membaca buku sejarah setiap hari.",
      "answer": "がくせい の とき、 まいにち まじめに れきし の ほん を よみました"
    },
    {
      "question": "Saat sedang sedih dan lelah, kamu ingin bicara dengan siapa?",
      "answer": "さびしくて つかれた とき、 だれ と はなしたい です か"
    },
    {
      "question": "Jika menekan tombol merah ini, mesin penjual otomatis akan mengeluarkan kembalian.",
      "answer": "この あかい ボタン を おす と、 じどうはんばいき が おつり を だします"
    },
    {
      "question": "Jika terus berjalan lurus, ada perempatan di sebelah kiri.",
      "answer": "まっすぐ いく と、 ひだり に こうさてん が あります"
    },
    {
      "question": "Saat menyeberang persimpangan jalan itu, mohon berhati-hati.",
      "answer": "あの こうさてん の みち を わたる とき、 き を つけて ください"
    },
    {
      "question": "Kipas angin ini tidak akan bergerak jika kabelnya belum dicolokkan.",
      "answer": "コード を ささない と、 この せんぷうき は うごきません"
    },
    {
      "question": "Suaranya akan membesar jika kita memutar tombol volume ini ke kanan.",
      "answer": "この つまみ を みぎ へ まわす と、 おと が おおきく なります"
    },
    {
      "question": "Waktu tidak bawa kacamata, saya tidak bisa membaca kanji surat kabar.",
      "answer": "めがね が ない とき、 しんぶん の かんじ を よむ こと が できません"
    },
    {
      "question": "Tolong matikan lampu saat keluar dari ruangan kelas.",
      "answer": "きょうしつ から でる とき、 でんき を けして ください"
    },
    {
      "question": "Musim semi tiba saat salju mulai mencair.",
      "answer": "ゆき が とける と、 はる が きます"
    },
    {
      "question": "Jika belok kanan di lampu merah itu, ada bank besar.",
      "answer": "あの しんごう を みぎ へ まがる と、 おおきな ぎんこう が あります"
    },
    {
      "question": "Jika malam datang, saya merasa kesepian di luar negeri.",
      "answer": "よる に なる と、 がいこく で さびしく なります"
    },
    {
      "question": "Waktu makan masakan pedas, hidung saya meler.",
      "answer": "からい りょうり を たべる とき、 はなみず が でます"
    },
    {
      "question": "Bila saya masih muda, saya memimpikan jalan-jalan keliling dunia.",
      "answer": "わかい とき、 せかいいっしゅう の りょこう を ゆめ みました"
    },
    {
      "question": "Apakah kamu menangis saat menonton film sedih itu?",
      "answer": "あの さびしい えいが を みた とき、なきました か"
    },
    {
      "question": "Mesin ini berbahaya jika disentuh dengan tangan basah.",
      "answer": "ぬれた て で さわる と、 この きかい は あぶない です"
    },
    {
      "question": "Waktu masih kecil, mainan kesukaanmu apa?",
      "answer": "こども の とき、 すきな おもちゃ は なん でした か"
    },
    {
      "question": "Jika menekan pedal ini kencang, mobil akan melaju sangat cepat.",
      "answer": "この ペダル を つよく おす と、 くるま は とても はやく うごきます"
    }
  ],
  "bab24": [
    {
      "question": "Ibu memberikan saya kado ulang tahun sebuah jam tangan mahal.",
      "answer": "はは は わたし の たんじょうび に たかい とけい を くれました"
    },
    {
      "question": "Karena barang bawaannya berat, siapa yang mau membantumu?",
      "answer": "にもつ が おもい です から、 だれ が てつだって くれます か"
    },
    {
      "question": "Saya membawakan teh hangat untuk manajer yang sedang lelah.",
      "answer": "わたし は つかれた ぶちょう に あたたかい おちゃ を いれて あげました"
    },
    {
      "question": "Sdr. Yamada yang pandai mengajari saya bahasa Inggris yang sulit.",
      "answer": "あたま が いい やまださん は わたし に むずかしい えいご を おしえて くれました"
    },
    {
      "question": "Saya mendapat kesempatan difotokan oleh fotografer terkenal itu.",
      "answer": "わたし は あの ゆうめいな カメラマン に しゃしん を とって もらいました"
    },
    {
      "question": "Kakek membelikan saya tiket konser musik penyanyi kesukaanku.",
      "answer": "おじいさん が わたし に すきな かしゅ の コンサート の きっぷ を かって くれました"
    },
    {
      "question": "Istri membuatkan bekal sehat yang lezat untuk dibawa suami bekerja.",
      "answer": "つま は おっと の しごと の ため に おいしくて げんきな おべんとう を つくって あげました"
    },
    {
      "question": "Permisi, tolong ajari saya cara menulis kanji nama orang ini.",
      "answer": "すみません、 この ひとの なまえ の かんじ の かきかた を おしえて くれません か"
    },
    {
      "question": "Sdr. Santos memperbaiki sepeda adik laki-laki saya yang rusak.",
      "answer": "サントスさん は こわれた おとうと の じてんしゃ を なおして くれました"
    },
    {
      "question": "Saya merapikan rumah dan mencucikan piring untuk ibu.",
      "answer": "わたし は はは に うち を そうじ して、 さら を あらって あげました"
    },
    {
      "question": "Karena hujannya lebat, teman saya meminjamkan payungnya untukku.",
      "answer": "おおあめ です から、 ともだち が わたし に かさ を かして くれました"
    },
    {
      "question": "Saya ditraktir makan makanan enak oleh Sdr. Tanaka kemarin.",
      "answer": "わたし は きのう たなかさん に おいしい たべもの を ごちそうして もらいました"
    },
    {
      "question": "Maukah kamu menunjukkan jalan ke rumah sakit terdekat?",
      "answer": "いちばん ちかい びょういん へ の みち を おしえて くれません か"
    },
    {
      "question": "Buku ini adalah buku langka yang dihadiahkan guru untuk saya.",
      "answer": "この ほん は せんせい が わたし に くれて 珍しい ほん です"
    },
    {
      "question": "Apakah kamu mau kubawakan tas besar milikmu itu?",
      "answer": "その おおきな かばん を もって あげましょう か"
    },
    {
      "question": "Suami saya kadang-kadang membacakan buku untuk anak kami sebelum tidur.",
      "answer": "おっと は ときどき ねる まえ に こども に ほん を よんで やります"
    },
    {
      "question": "Ayah, tolong belikan saya komputer pribadi (PC) baru ya.",
      "answer": "おとうさん、 わたし に あたらしい パソコン を かって ください ね"
    },
    {
      "question": "Teman saya membuatkan saya sarapan setiap pagi di asrama.",
      "answer": "ともだち は りょう で まいあさ わたし に あさごはん を つくって くれます"
    },
    {
      "question": "Sdr. Karina mendapatkan penjelasan penggunaan mesin fotokopi dari pegawai.",
      "answer": "カリナさん は えきいん に コピーき の つかいかた を せつめい して もらいました"
    },
    {
      "question": "Uang ini diberikan kakek untuk perayaan masuk universitas.",
      "answer": "この おかね は おじいさん が だいがく に はいる おいわい に くれました"
    }
  ],
  "bab25": [
    {
      "question": "Kalau besok turun hujan deras, aku pasti tidak akan pergi bermain.",
      "answer": "あした おおあめ が ふったら、 わたし は ぜったい あそび に いきません"
    },
    {
      "question": "Jika punya banyak uang miliaran yen, kamu mau membeli apa?",
      "answer": "じゅうおくえん ぐらい たくさん おかね が あったら、 なに を かいたい です か"
    },
    {
      "question": "Kalau sudah sampai di stasiun shinkansen, tolong cepat telepon saya.",
      "answer": "しんかんせん の えき に ついたら、 はやく わたし に でんわ を して ください"
    },
    {
      "question": "Walaupun baju itu harganya murah, saya tetap tidak akan membelinya.",
      "answer": "その ふく は やすくても、 わたし は かいません"
    },
    {
      "question": "Walaupun sedang turun salju lebat, saya tetap harus pergi bekerja lembur.",
      "answer": "おおゆき が ふっても、 ざんぎょう し に いかなければ なりません"
    },
    {
      "question": "Walaupun sudah memikirkan solusinya lama, saya tetap tidak mengerti juga.",
      "answer": "ながい じかん かんがえても、 やっぱり わかりません"
    },
    {
      "question": "Jika kamu besok sangat sibuk dan capek, tidak perlu memaksakan datang kok.",
      "answer": "あした とても いそがしくて つかれたら、 むり して こなくても いい です よ"
    },
    {
      "question": "Jika kamu sudah jadi kakek-kakek nanti, kamu berencana hidup tenang di mana?",
      "answer": "おじいさん に なったら、 どこ で しずかに すむ つもり です か"
    },
    {
      "question": "Kalau libur musim panas tahun depan tiba, mari kita mendaki Gunung Fuji.",
      "answer": "らいねん の なつやすみ に なったら、 ふじさん に のぼりましょう"
    },
    {
      "question": "Walaupun sakit perut dan demam tinggi, dia tidak mau minum obat.",
      "answer": "おなか が いたくて ねつ が たかくても、 かれ は くすり を のみません"
    },
    {
      "question": "Seandainya kamu tidak belajar keras, kamu tidak akan bisa lulus ujian N3.",
      "answer": "たくさん べんきょう しなかったら、 N３ の しけん に ごうかく する こと が できません"
    },
    {
      "question": "Jika mesin cuci ini rusak, tolong tekan tombol kuning untuk memperbaikinya.",
      "answer": "この せんたくき が こわれたら、 きいろい ボタン を おして なおして ください"
    },
    {
      "question": "Kalau AC ruangannya dimatikan, udaranya segera menjadi panas ya.",
      "answer": "エアコン を けしたら、 へや の くうき が すぐ あつく なります ね"
    },
    {
      "question": "Walaupun tidak mengerti bahasa Jepang sama sekali, tidak apa-apa kalau pakai penerjemah.",
      "answer": "にほんご が ぜんぜん わからなくても、 ほんやくき を つかったら だいじょうぶ です"
    },
    {
      "question": "Kalau pacar kamu marah, kamu akan meminta maaf atau memberinya hadiah?",
      "answer": "こいびと が おこったら、 あやまります か、 プレゼント を あげます か"
    },
    {
      "question": "Meskipun sudah minum kopi empat gelas, saya tetap mengantuk sekali.",
      "answer": "コーヒー を よんはい のんでも、 やっぱり とても ねむい です"
    },
    {
      "question": "Kalau kamu sedang mencari kamus bagus, kamus digital sangat direkomendasikan.",
      "answer": "いい じしょ を さがして いたら、 でんしじしょ は とても おすすめ です"
    },
    {
      "question": "Kalau Sdr. Tanaka tidak mau ikut pergi, saya juga mendingan tidak pergi.",
      "answer": "たなかさん が いかなかったら、 わたし も いきません"
    },
    {
      "question": "Walaupun komputer ini kelihatannya model tua, nyatanya masih sangat cepat.",
      "answer": "この パソコン は ふるく みえても、 ほんとう は まだ とても はやい です"
    },
    {
      "question": "Bila laporan ini sudah selesai ditulis, saya akan segera pulang kerumah.",
      "answer": "この レポート が おわったら、 わたし は すぐ うち へ かえります"
    }
  ]
};
async function main() {
  console.log('Menyimpan 20 soal berkualitas tinggi (Minna no Nihongo advance)...');
  if (!fs.existsSync(outDir)) { fs.mkdirSync(outDir, { recursive: true }); }
  for (const [babName, questions] of Object.entries(dataSoal)) {
    const filePath = path.join(outDir, `${babName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf-8');
    console.log(`✅ ${babName}.json berisikan ${questions.length} soal Bunpou Tersulit.`);
  }
}
main();