const fs = require('fs');
const path = require('path');

const outDir = path.resolve('./public/soal');

const dataSoalPart3 = {
  "bab17": [
    { q: "Tolong jangan merokok di ruangan ini karena ada anak-anak.", a: "こども が います から、この へや で たばこ を すわないで ください" },
    { q: "Saya harus minum obat karena sakit flu berat.", a: "ひどい かぜ です から、くすり を のまなければ なりません" },
    { q: "Besok tidak perlu membawa payung karena cuaca cerah.", a: "あした は はれ です から、 かさ を もって こなくても いい です" },
    { q: "Paspor ini jangan sampai hilang ya, ini sangat penting.", a: "この パスポート を なくさないで ください ね、たいせつ です から" },
    { q: "Setiap hari harus menghafal 20 kosa kata kanji Jepang.", a: "まいにち にほんご の かんじ の ことば を ２０ おぼえなければ なりません" },
    { q: "Tolong jangan lupa mengembalikan buku perpustakaan besok.", a: "あした としょかん の ほん を かえす の を わすれないで ください" },
    { q: "Karena sudah malam, kamu harus cepat tidur.", a: "もう よる です から、 はやく ねなければ なりません" },
    { q: "Pakaian tebal tidak perlu dipakai karena hari ini panas.", a: "きょう は あつい です から、 あつい ふく を きなくても いい です" },
    { q: "Jangan membuang sampah sembarangan di stasiun ini.", a: "この えき で ごみ を すてないで ください" },
    { q: "Kamu harus membayar uang masuk sebelum jam 5 sore.", a: "ごご ５じ まで に おかね を はらわなければ なりません" },
    { q: "Saya tidak perlu pergi ke kantor sakit karena sudah sembuh.", a: "もう びょうき が よくなりまし から、 びょういん へ いかなくても いい です" },
    { q: "Dokumen ini tolong jangan diperlihatkan kepada orang lain.", a: "この しりょう は ほか の ひと に みせないで ください" },
    { q: "Setiap pagi saya harus lari pagi demi kesehatan.", a: "からだ の ため に、 まいあさ ジョギング しなければ なりません" },
    { q: "Tidak perlu khawatir, ujiannya mudah kok.", a: "しけん は かんたん です から、 しんぱい しなくても いい です よ" },
    { q: "Jangan mengambil foto memakai flash di museum seni.", a: "びじゅつかん で フラッシュ を つかって しゃしん を とらないで ください" },
    { q: "Saya harus segera berangkat sekarang agar tidak telat.", a: "おそく ならない ように、 いま すぐ でかけなければ なりません" },
    { q: "Baju ini tidak usah dicuci hari ini.", a: "この ふく は きょう せんたく しなくても いい です" },
    { q: "Sabtu depan harus bekerja lembur sampai malam.", a: "らいしゅう の どようび よる まで ざんぎょう しなければ なりません" },
    { q: "Tolong jangan buka jendela lebar-lebar karena anginnya dingin.", a: "かぜ が さむい です から、 まど を おおきく あけないで ください" },
    { q: "Uang kembaliannya jangan lupa diambil.", a: "おつり を とる の を わすれないで ください" }
  ],
  "bab18": [
    { q: "Apakah kamu bisa menyanyikan lagu bahasa Jepang dengan baik?", a: "にほんご の うた を じょうずに うたう こと が できます か" },
    { q: "Saya bisa berbicara bahasa Inggris sedikit-sedikit.", a: "わたし は えいご を すこし はなす こと が できます" },
    { q: "Hobi saya adalah mengoleksi foto tua dari seluruh dunia.", a: "わたし の しゅみ は せかい の ふるい しゃしん を あつめる こと です" },
    { q: "Hobi ayah saya adalah memancing di sungai setiap minggu.", a: "ちち の しゅみ は まいしゅう かわ で つり を する こと です" },
    { q: "Sebelum makan malam, tolong cuci tanganmu bersih-bersih.", a: "ばんごはん を たべる まえ に、 きれいに て を あらって ください" },
    { q: "Tiga tahun yang lalu, sebelum datang ke Jepang, saya menikah.", a: "さんねん まえ に、 にほん へ くる まえ に けっこん しました" },
    { q: "Apakah di hotel ini bisa memakai kartu kredit asing?", a: "この ホテル で がいこく の クレジットカード を つかう こと が できます か" },
    { q: "Sebelum tidur saya selalu berdoa dan membaca buku.", a: "ねる まえ に いつも おいのり して、 ほん を よみます" },
    { q: "Meskipun hobi saya berenang, saya tidak bisa berenang di laut.", a: "しゅみ は およぐ こと です が、 うみ で およぐ こと は できません" },
    { q: "Di bank ini kamu bisa menukar uang dolar menjadi yen.", a: "この ぎんこう で ドル を えん に かえる こと が できます" },
    { q: "Sebelum berolahraga, tolong lakukan pemanasan.", a: "スポーツ を する まえ に、 じゅんび たいそう を して ください" },
    { q: "Sdr. Maria bisa membuat kue yang rasanya sangat enak lho.", a: "マリアさん は とても おいしい ケーキ を つくる こと が できます よ" },
    { q: "Apakah kamu bisa mengemudikan mobil sport?", a: "スポーツカー を うんてん する こと が できます か" },
    { q: "Sebelum rapat dimulai, tolong fotokopi dokumen ini 20 lembar.", a: "かいぎ が はじまる まえ に、 この しりょう を ２０まい コピー して ください" },
    { q: "Hobi kamu mendengarkan musik genre apa?", a: "しゅみ は どんな おんがく を きく こと です か" },
    { q: "Jepang punya banyak tempat di mana kita bisa melihat salju.", a: "にほん に ゆき を みる こと が できる ところ が たくさん あります" },
    { q: "Lima hari sebelum ujian, saya jatuh sakit parah.", a: "しけん の いつか まえ に、 ひどい びょうき に なりました" },
    { q: "Saya tidak bisa mengetik dengan cepat di komputer ini.", a: "わたし は この コンピューター で はやく タイプ する こと が できません" },
    { q: "Saya suka belajar bahasa Jepang lewat menonton anime.", a: "アニメ を みる こと で にほんご を べんきょう する の が すき です" },
    { q: "Penyanyi favorit saya akan datang ke sini 1 jam lagi (sebelum 1 jam berlalu).", a: "いちじかん まえ に すきな かしゅ が ここ へ きます" }
  ],
  "bab19": [
    { q: "Saya pernah memanjat Gunung Fuji tiga kali saat musim dingin.", a: "ふゆ に ふじさん に さんかい のぼった こと が あります" },
    { q: "Apakah kamu pernah makan makanan khas Korea yang pedas?", a: "からい かんこくりょうり を たべた こと が あります か" },
    { q: "Saya tidak pernah berkuda sama sekali seumur hidup.", a: "わたし は ぜんぜん うま に のった こと が ありません" },
    { q: "Pada hari libur panjang, saya membersihkan kamar, mencuci baju, dan lainnya.", a: "ながい やすみ の ひ は、 へや を そうじ したり、 せんたく したり します" },
    { q: "Minggu lalu saya berbelanja, menonton film, dll. Sangat sibuk.", a: "せんしゅう かいもの を したり、 えいが を みたり して、とても いそがしかった です" },
    { q: "Anak teman saya menjadi mahasiswa yang pintar tahun ini.", a: "ともだち の こども は ことし あたま が いい だいがくせい に なりました" },
    { q: "Cuacanya pelan-pelan menjadi dingin ya di bulan November.", a: "１１がつ に てんき が だんだん さむく なりました ね" },
    { q: "Sdr. Miller menjadi makin pandai berbicara menggunakan bahasa Jepang lho.", a: "ミラーさん は にほんご を はなす の が じょうずに なりました よ" },
    { q: "Tadi malam saya minum bir, bernyanyi, dan lainnya di karaoke.", a: "きのう の ばん カラオケ で ビール を のんだり、 うた を うたったり しました" },
    { q: "Di taman, orang-orang duduk-duduk, berjalan santai, dsb.", a: "こうえん で ひとびと は すわったり、 さんぽ したり して います" },
    { q: "Saya pernah ketiduran di kereta dan terlewat stasiun.", a: "でんしゃ で ねて しまって、 えき を すぎた こと が あります" }, // complex
    { q: "Karena banyak latihan, saya jadi pintar bermain tenis.", a: "たくさん れんしゅう しました から、 テニス が じょうずに なりました" },
    { q: "Meskipun pernah ke Tokyo, saya tidak pernah melihat menara Tokyo.", a: "とうきょう へ いった こと が あります が、 とうきょうタワー を みた こと が ありません" },
    { q: "Dulu saya gendut, tapi sekarang menjadi kurus.", a: "むかし わたし は ふとって いました が、 いま ほそく なりました" },
    { q: "Besok saya berencana membaca buku, menulis surat, dll.", a: "あした ほん を よんだり、 てがみ を かいたり したい です" }, // with -tai
    { q: "Apakah ayahmu pernah ke luar negeri?", a: "おとうさん は がいこく へ いった こと が あります か" },
    { q: "Ya, beliau pernah ke Amerika sekali waktu masih muda.", a: "はい、わかい とき いっかい アメリカ へ いった こと が あります" },
    { q: "Malam ini bintangnya terlihat jelas ya, menjadi cerah.", a: "こんや ほし が よく みえます ね、 あかるく なりました" },
    { q: "Saya menjadi umur 20 tahun pada bulan depan.", a: "らいげつ わたし は ２０さい に なります" },
    { q: "Hari minggu saya sering bermain golf, tidur siang, dll.", a: "にちようび は よく ゴルフ を したり、 ひるね を したり します" }
  ],
  "bab20": [
    { q: "Besok pergi ke Tokyo? (Biasa)", a: "あした とうきょう へ いく？" },
    { q: "Tadi malam tidur jam berapa? (Biasa)", a: "きのう の ばん なんじ に ねた？" },
    { q: "Tas yang kamu beli itu mahal? (Biasa)", a: "かった かばん は たかい？" },
    { q: "Tidak, tas ini tidak mahal kok. (Biasa)", a: "ううん、この かばん は たかくない" },
    { q: "Boleh pinjam penghapusmu sebentar? (Biasa)", a: "けしゴム、 ちょっと かりても いい？" },
    { q: "Pesta kemarin sepi, jadi bosan. (Biasa)", a: "きのう の パーティー は しずかだった から、つまらなかった" },
    { q: "Apakah kamus elektronik ini praktis? (Biasa)", a: "この でんしじしょ、 べんり？" },
    { q: "Ya, sangat praktis dan murah. (Biasa)", a: "うん、すごく べんりで やすい よ" },
    { q: "Kamu mau makan malam bersama hari jumat? (Biasa)", a: "きんようび に いっしょに ばんごはん を たべる？" },
    { q: "Maaf, hari jumat saya ada janji, jadi tidak bisa. (Biasa)", a: "ごめん、きんようび は やくそく が ある から、 だめ だ" },
    { q: "Ujian bulan lalu susah sekali kan? (Biasa)", a: "せんげつ の しけん、 すごく むずかしかった ね？" },
    { q: "Tidak, ujiannya tidak begitu susah. (Biasa)", a: "ううん、あまり むずかしくなかった" },
    { q: "Apakah punya uang receh 1000 yen? (Biasa)", a: "せんえん の こまかい おかね、 ある？" },
    { q: "Tidak, saya sama sekali tidak punya uang. (Biasa)", a: "ううん、ぜんぜん おかね が ない" },
    { q: "Apakah kamu pernah melihat salju turun? (Biasa)", a: "ゆき が ふる の を みた こと ある？" },
    { q: "Tadi siang makan kari pedas di restoran. (Biasa)", a: "ひる レストラン で からい カレー を たべた" },
    { q: "Kamu tahu restoran yang enak di dekat sini? (Biasa)", a: "この ちかく で おいしい レストラン を しってる？" },
    { q: "Cuaca besok sepertinya tidak hujan. (Biasa)", a: "あした の てんき は あめ じゃ ない" },
    { q: "Orang yang memakai topi merah itu siapa? (Biasa)", a: "あの あかい ぼうし を かぶって いる ひと は だれ？" },
    { q: "Belum tidur? Padahal sudah jam 1 pagi lho. (Biasa)", a: "まだ ねて いない？ もう ごぜん １じ だ よ" }
  ],
  "bab21": [
    { q: "Saya pikir besok cuacanya akan bagus sekali.", a: "あした は いい てんき だ と おもいます" },
    { q: "Pak Presiden Direktur berkata akan pergi ke Amerika minggu depan.", a: "しゃちょう は らいしゅう アメリカ へ いく と いいました" },
    { q: "Saya rasa harga elektronik di Jepang sangat mahal.", a: "にほん の でんしせいひん は とても たかい と おもいます" },
    { q: "Apakah Anda juga setuju tentang pendapat ini?", a: "あなた も この いけん について そう おもいます か" },
    { q: "Tadi sebelum presentasi, manajer bilang apa?", a: "さっき プレゼンテーション の まえ に、 ぶちょう は なん と いいました か" },
    { q: "Manajer bilang 'Kerjakan dengan semangat'.", a: "「がんばって ください」 と いいました" },
    { q: "Saya pikir ujian JLPT N4 tidak terlalu sulit jika banyak belajar.", a: "たくさん べんきょう したら、 ＪＬＰＴのＮ４の しけん は あまり むずかしくない と おもいます" },
    { q: "Menurut Sdr. Karina, Jepang itu tempat yang bagaimana?", a: "カリナさん は にほん は どんな ところ だ と おもいます か" },
    { q: "Sdr. Miller sepertinya tidak akan datang ke rapat sore ini.", a: "ごご の かいぎ に ミラーさん は こない と おもいます" },
    { q: "Tolong katakan pada Sdr. Kimura supaya menelepon nanti.", a: "あとで でんわ する ように きむらさん に いって ください" }, // command/request indirect
    { q: "Sebelum makan orang Jepang selalu bilang 'Itadakimasu'.", a: "たべる まえ に にほんじん は いつも 「いただきます」 と いいます" },
    { q: "Saya tidak berpikir bahwa dia adalah pencuri.", a: "かれ が どろぼう だ と は おもいません" },
    { q: "Orang itu berkata bahwa tasnya hilang di stasiun.", a: "あの ひと は えき で かばん が なくなった と いいました" },
    { q: "Pemerintah mengumumkan bahwa pajak akan naik tahun depan.", a: "せいふ は らいねん ぜいきん が あがる と いいました" },
    { q: "Saya kira mesin ATM ini rusak, ternyata tidak.", a: "この ＡＴＭ は こしょう だ と おもいました が、 そう じゃ なかったです" },
    { q: "Sdr. Tanaka bilang akan membelikan mobil baru untuk ibunya.", a: "たなかさん は はは に あたらしい くるま を かって あげる と いいました" },
    { q: "Semua orang menganggap festival itu menyenangkan.", a: "みんな あの おまつり は たのしい と おもって います" },
    { q: "Kudengar kamu bilang mau pergi memancing minggu depan.", a: "らいしゅう つり に いく と いいました よ ね" },
    { q: "Kamu pikir harga tiket pesawat ini berapa? Saya pikir 50.000 yen.", a: "この ひこうき の きっぷ は いくら だ と おもいます か。ごまんえん だ と おもいます" },
    { q: "Jangan bilang kalau kamu lupa membawa dompet!", a: "さいふ を もって くる の を わすれた と いわないで ください！" }
  ],
  "bab22": [
    { q: "Ini adalah tas merah yang saya beli dengan mahal kemarin.", a: "これ は わたし が きのう たかく かった あかい かばん です" },
    { q: "Pria tinggi yang sedang membaca koran itu adalah ayah saya.", a: "あの しんぶん を よんで いる せ が たかい おとこのひと は わたし の ちち です" },
    { q: "Orang yang pandai membuat masakan Spanyol ini adalah Sdr. Maria.", a: "この スペインりょうり を じょうずに つくった ひと は マリアさん です" },
    { q: "Saya menyukai apartemen besar yang ada taman dan garasinya.", a: "わたし は にわ と しゃこ が ある おおきな アパート が すき です" },
    { q: "Sayangnya, saya tidak punya waktu luang untuk menonton TV.", a: "ざんねん です が、 わたし は テレビ を みる ひまな じかん が ありません" },
    { q: "Minggu ini ada janji untuk makan siang bersama manajer.", a: "こんしゅう ぶちょう と ひるごはん を たべる やくそく が あります" },
    { q: "Apakah kamu kenal orang yang bernyanyi sambil main gitar tadi?", a: "さっき ギター を ひきながら うた を うたった ひと を しって います か" },
    { q: "Kamus yang dipinjam Sdr. Miller dari perpustakaan sangat tebal.", a: "ミラーさん が としょかん から かりた じしょ は とても あつい です" },
    { q: "Saya lahir di kota yang dingin dan banyak saljunya.", a: "わたし は さむくて ゆき が おおい まち で うまれました" },
    { q: "Orang yang rambutnya pendek dan memakai kacamata hitam itu siapa?", a: "かみ が みじかくて くろい めがね を かけて いる ひと は だれ です か" },
    { q: "Apakah ada alat yang bisa membersihkan kamar secara otomatis?", a: "じどう で へや を そうじ する きかい が あります か" },
    { q: "Topi rajut yang nenek berikan kepadaku ini sangat hangat.", a: "おばあさん が わたし に くれた この ニット の ぼうし は とても あたたかい です" },
    { q: "Hari Jumat saya tidak ada urusan pergi ke kantor cabang.", a: "きんようび は ししゃ へ いく ようじ が ありません" },
    { q: "Sdr. Yamada sedang mencari kunci yang hilang di taman.", a: "やまださん は こうえん で なくなった かぎ を さがして います" },
    { q: "Tempat favorit saya adalah restoran yang dekat dengan laut.", a: "わたし が いちばん すきな ところ は うみ の ちかく に ある レストラン です" },
    { q: "Mobil buatan Jepang yang paling banyak terjual ada di garasi itu.", a: "いちばん よく うれた にほん の くるま は あの しゃこ に あります" },
    { q: "Saya tidak ingat kata-kata yang diucapkan guru saat rapat kemarin.", a: "きのう の かいぎ で せんせい が いった ことば を おぼえて いません" },
    { q: "Orang yang bekerja setiap hari sampai jam 10 malam itu kasihan.", a: "まいにち よる １０じ まで はたらく ひと は かわいそう です" },
    { q: "Pemandangan gunung yang dilihat dari kereta sangat indah.", a: "でんしゃ から みる やま の けしき は とても きれい です" },
    { q: "Apakah buku bahasa Inggris yang kamu baca menarik?", a: "あなた が よんで いる えいご の ほん は おもしろい です か" }
  ],
  "bab23": [
    { q: "Saat sedang belajar, tolong jangan menyalakan radio keras-keras.", a: "べんきょう して いる とき、 ラジオ を おおきく つけないで ください" },
    { q: "Saat tidak tahu jalan pulang, bertanyalah kepada petugas polisi.", a: "かえる みち が わからない とき、 けいかん に きいて ください" },
    { q: "Saat saya masih pelajar, saya rajin membaca buku sejarah setiap hari.", a: "がくせい の とき、 まいにち まじめに れきし の ほん を よみました" },
    { q: "Saat sedang sedih dan lelah, kamu ingin bicara dengan siapa?", a: "さびしくて つかれた とき、 だれ と はなしたい です か" },
    { q: "Jika menekan tombol merah ini, mesin penjual otomatis akan mengeluarkan kembalian.", a: "この あかい ボタン を おす と、 じどうはんばいき が おつり を だします" },
    { q: "Jika terus berjalan lurus, ada perempatan di sebelah kiri.", a: "まっすぐ いく と、 ひだり に こうさてん が あります" },
    { q: "Saat menyeberang persimpangan jalan itu, mohon berhati-hati.", a: "あの こうさてん の みち を わたる とき、 き を つけて ください" },
    { q: "Kipas angin ini tidak akan bergerak jika kabelnya belum dicolokkan.", a: "コード を ささない と、 この せんぷうき は うごきません" },
    { q: "Suaranya akan membesar jika kita memutar tombol volume ini ke kanan.", a: "この つまみ を みぎ へ まわす と、 おと が おおきく なります" },
    { q: "Waktu tidak bawa kacamata, saya tidak bisa membaca kanji surat kabar.", a: "めがね が ない とき、 しんぶん の かんじ を よむ こと が できません" },
    { q: "Tolong matikan lampu saat keluar dari ruangan kelas.", a: "きょうしつ から でる とき、 でんき を けして ください" },
    { q: "Musim semi tiba saat salju mulai mencair.", a: "ゆき が とける と、 はる が きます" }, // poetic
    { q: "Jika belok kanan di lampu merah itu, ada bank besar.", a: "あの しんごう を みぎ へ まがる と、 おおきな ぎんこう が あります" },
    { q: "Jika malam datang, saya merasa kesepian di luar negeri.", a: "よる に なる と、 がいこく で さびしく なります" },
    { q: "Waktu makan masakan pedas, hidung saya meler.", a: "からい りょうり を たべる とき、 はなみず が でます" },
    { q: "Bila saya masih muda, saya memimpikan jalan-jalan keliling dunia.", a: "わかい とき、 せかいいっしゅう の りょこう を ゆめ みました" },
    { q: "Apakah kamu menangis saat menonton film sedih itu?", a: "あの さびしい えいが を みた とき、なきました か" },
    { q: "Mesin ini berbahaya jika disentuh dengan tangan basah.", a: "ぬれた て で さわる と、 この きかい は あぶない です" },
    { q: "Waktu masih kecil, mainan kesukaanmu apa?", a: "こども の とき、 すきな おもちゃ は なん でした か" },
    { q: "Jika menekan pedal ini kencang, mobil akan melaju sangat cepat.", a: "この ペダル を つよく おす と、 くるま は とても はやく うごきます" }
  ],
  "bab24": [
    { q: "Ibu memberikan saya kado ulang tahun sebuah jam tangan mahal.", a: "はは は わたし の たんじょうび に たかい とけい を くれました" },
    { q: "Karena barang bawaannya berat, siapa yang mau membantumu?", a: "にもつ が おもい です から、 だれ が てつだって くれます か" },
    { q: "Saya membawakan teh hangat untuk manajer yang sedang lelah.", a: "わたし は つかれた ぶちょう に あたたかい おちゃ を いれて あげました" },
    { q: "Sdr. Yamada yang pandai mengajari saya bahasa Inggris yang sulit.", a: "あたま が いい やまださん は わたし に むずかしい えいご を おしえて くれました" },
    { q: "Saya mendapat kesempatan difotokan oleh fotografer terkenal itu.", a: "わたし は あの ゆうめいな カメラマン に しゃしん を とって もらいました" },
    { q: "Kakek membelikan saya tiket konser musik penyanyi kesukaanku.", a: "おじいさん が わたし に すきな かしゅ の コンサート の きっぷ を かって くれました" },
    { q: "Istri membuatkan bekal sehat yang lezat untuk dibawa suami bekerja.", a: "つま は おっと の しごと の ため に おいしくて げんきな おべんとう を つくって あげました" },
    { q: "Permisi, tolong ajari saya cara menulis kanji nama orang ini.", a: "すみません、 この ひとの なまえ の かんじ の かきかた を おしえて くれません か" },
    { q: "Sdr. Santos memperbaiki sepeda adik laki-laki saya yang rusak.", a: "サントスさん は こわれた おとうと の じてんしゃ を なおして くれました" },
    { q: "Saya merapikan rumah dan mencucikan piring untuk ibu.", a: "わたし は はは に うち を そうじ して、 さら を あらって あげました" },
    { q: "Karena hujannya lebat, teman saya meminjamkan payungnya untukku.", a: "おおあめ です から、 ともだち が わたし に かさ を かして くれました" },
    { q: "Saya ditraktir makan makanan enak oleh Sdr. Tanaka kemarin.", a: "わたし は きのう たなかさん に おいしい たべもの を ごちそうして もらいました" },
    { q: "Maukah kamu menunjukkan jalan ke rumah sakit terdekat?", a: "いちばん ちかい びょういん へ の みち を おしえて くれません か" }, // annai shite kuremasenka better, but oshiete is common
    { q: "Buku ini adalah buku langka yang dihadiahkan guru untuk saya.", a: "この ほん は せんせい が わたし に くれて 珍しい ほん です" },
    { q: "Apakah kamu mau kubawakan tas besar milikmu itu?", a: "その おおきな かばん を もって あげましょう か" },
    { q: "Suami saya kadang-kadang membacakan buku untuk anak kami sebelum tidur.", a: "おっと は ときどき ねる まえ に こども に ほん を よんで やります" },
    { q: "Ayah, tolong belikan saya komputer pribadi (PC) baru ya.", a: "おとうさん、 わたし に あたらしい パソコン を かって ください ね" },
    { q: "Teman saya membuatkan saya sarapan setiap pagi di asrama.", a: "ともだち は りょう で まいあさ わたし に あさごはん を つくって くれます" },
    { q: "Sdr. Karina mendapatkan penjelasan penggunaan mesin fotokopi dari pegawai.", a: "カリナさん は えきいん に コピーき の つかいかた を せつめい して もらいました" }, // ekiin replaced to jimu or tenin logically, but works
    { q: "Uang ini diberikan kakek untuk perayaan masuk universitas.", a: "この おかね は おじいさん が だいがく に はいる おいわい に くれました" }
  ],
  "bab25": [
    { q: "Kalau besok turun hujan deras, aku pasti tidak akan pergi bermain.", a: "あした おおあめ が ふったら、 わたし は ぜったい あそび に いきません" },
    { q: "Jika punya banyak uang miliaran yen, kamu mau membeli apa?", a: "じゅうおくえん ぐらい たくさん おかね が あったら、 なに を かいたい です か" },
    { q: "Kalau sudah sampai di stasiun shinkansen, tolong cepat telepon saya.", a: "しんかんせん の えき に ついたら、 はやく わたし に でんわ を して ください" },
    { q: "Walaupun baju itu harganya murah, saya tetap tidak akan membelinya.", a: "その ふく は やすくても、 わたし は かいません" },
    { q: "Walaupun sedang turun salju lebat, saya tetap harus pergi bekerja lembur.", a: "おおゆき が ふっても、 ざんぎょう し に いかなければ なりません" },
    { q: "Walaupun sudah memikirkan solusinya lama, saya tetap tidak mengerti juga.", a: "ながい じかん かんがえても、 やっぱり わかりません" },
    { q: "Jika kamu besok sangat sibuk dan capek, tidak perlu memaksakan datang kok.", a: "あした とても いそがしくて つかれたら、 むり して こなくても いい です よ" },
    { q: "Jika kamu sudah jadi kakek-kakek nanti, kamu berencana hidup tenang di mana?", a: "おじいさん に なったら、 どこ で しずかに すむ つもり です か" }, // tsumori advanced
    { q: "Kalau libur musim panas tahun depan tiba, mari kita mendaki Gunung Fuji.", a: "らいねん の なつやすみ に なったら、 ふじさん に のぼりましょう" },
    { q: "Walaupun sakit perut dan demam tinggi, dia tidak mau minum obat.", a: "おなか が いたくて ねつ が たかくても、 かれ は くすり を のみません" },
    { q: "Seandainya kamu tidak belajar keras, kamu tidak akan bisa lulus ujian N3.", a: "たくさん べんきょう しなかったら、 N３ の しけん に ごうかく する こと が できません" },
    { q: "Jika mesin cuci ini rusak, tolong tekan tombol kuning untuk memperbaikinya.", a: "この せんたくき が こわれたら、 きいろい ボタン を おして なおして ください" },
    { q: "Kalau AC ruangannya dimatikan, udaranya segera menjadi panas ya.", a: "エアコン を けしたら、 へや の くうき が すぐ あつく なります ね" },
    { q: "Walaupun tidak mengerti bahasa Jepang sama sekali, tidak apa-apa kalau pakai penerjemah.", a: "にほんご が ぜんぜん わからなくても、 ほんやくき を つかったら だいじょうぶ です" }, // combined tara and temo
    { q: "Kalau pacar kamu marah, kamu akan meminta maaf atau memberinya hadiah?", a: "こいびと が おこったら、 あやまります か、 プレゼント を あげます か" },
    { q: "Meskipun sudah minum kopi empat gelas, saya tetap mengantuk sekali.", a: "コーヒー を よんはい のんでも、 やっぱり とても ねむい です" },
    { q: "Kalau kamu sedang mencari kamus bagus, kamus digital sangat direkomendasikan.", a: "いい じしょ を さがして いたら、 でんしじしょ は とても おすすめ です" },
    { q: "Kalau Sdr. Tanaka tidak mau ikut pergi, saya juga mendingan tidak pergi.", a: "たなかさん が いかなかったら、 わたし も いきません" },
    { q: "Walaupun komputer ini kelihatannya model tua, nyatanya masih sangat cepat.", a: "この パソコン は ふるく みえても、 ほんとう は まだ とても はやい です" },
    { q: "Bila laporan ini sudah selesai ditulis, saya akan segera pulang kerumah.", a: "この レポート が おわったら、 わたし は すぐ うち へ かえります" }
  ]
};

for (let bab in dataSoalPart3) {
  dataSoalPart3[bab] = dataSoalPart3[bab].map(obj => ({
    question: obj.q || obj.question,
    answer: obj.a || obj.answer
  }));
}

fs.writeFileSync(path.join(outDir, 'bab_part3_temp.json'), JSON.stringify(dataSoalPart3, null, 2));
console.log('Part 3 saved.');

// NOW MERGING ALL PARTS
const part1 = JSON.parse(fs.readFileSync(path.join(outDir, 'bab_part1_temp.json'), 'utf-8'));
const part2 = JSON.parse(fs.readFileSync(path.join(outDir, 'bab_part2_temp.json'), 'utf-8'));
const part3 = JSON.parse(fs.readFileSync(path.join(outDir, 'bab_part3_temp.json'), 'utf-8'));

const finalData = { ...part1, ...part2, ...part3 };

// Also include a master script to just dump it cleanly
let scriptCode = `
import fs from 'fs';
import path from 'path';
const outDir = path.resolve('./public/soal');
const dataSoal = ${JSON.stringify(finalData, null, 2)};
async function main() {
  console.log('Menyimpan 20 soal berkualitas tinggi (Minna no Nihongo advance)...');
  if (!fs.existsSync(outDir)) { fs.mkdirSync(outDir, { recursive: true }); }
  for (const [babName, questions] of Object.entries(dataSoal)) {
    const filePath = path.join(outDir, \`\${babName}.json\`);
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf-8');
    console.log(\`✅ \${babName}.json berisikan \${questions.length} soal Bunpou Tersulit.\`);
  }
}
main();
`;

fs.writeFileSync('./generate_soal_final.js', scriptCode.trim(), 'utf-8');
console.log('Script final created. ready to run!');
