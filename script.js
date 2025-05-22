class Question {
    // Konstruktor untuk membuat objek pertanyaan dengan teks pertanyaan, pilihan jawaban, dan jawaban yang benar
    constructor(question, answers, correctAnswer) {
        this.question = question; // Teks pertanyaan
        this.answers = answers; // Array pilihan jawaban
        this.correctAnswer = correctAnswer; // Jawaban yang benar
    }

    // Metode untuk memeriksa apakah jawaban yang diberikan benar
    isCorrect(answer) {
        return answer === this.correctAnswer;
    }
}

class Quiz {
    // Konstruktor untuk inisialisasi quiz dengan daftar pertanyaan, indeks pertanyaan saat ini, skor, dan riwayat skor
    constructor() {
        this.questions = []; // Array untuk menyimpan objek pertanyaan
        this.currentIndex = 0; // Indeks pertanyaan saat ini
        this.score = 0; // Skor pengguna
        this.history = this.loadHistory(); // Memuat riwayat skor dari localStorage
    }

    // Mengambil pertanyaan quiz secara statis (tidak dari API) dalam bahasa Indonesia
    async fetchQuestions() {
        // Gunakan pertanyaan statis dalam bahasa Indonesia
        this.questions = [
            new Question(
                "Jumlah Warna pada Rubik's Cube?",
                ["6", "4", "2", "8"],
                "6"
            ),
            new Question(
                "Negara Pertama Pembuat Keju?",
                ["Skotlandia", "Switzerland", "Mesir", "Indonesia"],
                "Mesir"
            ),
            new Question(
                "Tumbuhan yang bisa bergerak dan memangsa serangga?",
                ["Mawar", "Moai", "Edelweiss", "Venus Fly Trap"],
                "Venus Fly Trap"
            ),
            new Question(
                "Pemenang Akademi Award Film Terbaik Tahun 2020?",
                ["Inside Out", "The Avengers", "Agak Laen", "Parasite"],
                "Parasite"
            ),
            new Question(
                "Berapa Jumlah Bola Pada Permainan Billiard?",
                ["14", "12", "16", "8"],
                "16"
            ),
            new Question(
                "Zat Alami Terkeras Di Bumi?",
                ["Diamond", "Iron", "Emerald", "Gold"],
                "Diamond"
            ),
            new Question(
                "Penemu Sepatu Hak Tiggi?",
                ["Martin Cooper", "Salvatore Ferragamo", "Steve Jobs", "Karl Benz"],
                "Salvatore Ferragamo"
            ),
            new Question(
                "Sutradara Film Inception?",
                ["Joko Anwar", "Christopher Nolan", "Jake Schreier", "Jeffrey Reddick"],
                "Christopher Nolan"
            ),
            new Question(
                "Apa Satuan Dari Gaya?",
                ["Atom", "Volume", "Newton", "Massa"],
                "Newton"
            ),
            new Question(
                "Hari Raya Tahun Imlek Dirayakan Pada Bulan?",
                ["Oktober-November", "November-Desember", "Desember-Januari", "Februari-Januari"],
                "Februari-Januari"
            )
        ];
    }

    // Mengambil pertanyaan saat ini berdasarkan indeks
    getCurrentQuestion() {
        return this.questions[this.currentIndex];
    }

    // Memproses jawaban pengguna dan mengembalikan apakah jawaban benar atau salah
    answerCurrentQuestion(answer) {
        const question = this.getCurrentQuestion();
        const correct = question.isCorrect(answer);
        if (correct) this.score++; // Tambah skor jika jawaban benar
        return correct;
    }

    // Melanjutkan ke pertanyaan berikutnya dengan menaikkan indeks
    nextQuestion() {
        this.currentIndex++;
    }

    // Memeriksa apakah quiz sudah selesai (semua pertanyaan sudah dijawab)
    isFinished() {
        return this.currentIndex >= this.questions.length;
    }

    // Menyimpan riwayat skor ke localStorage dengan tanggal, skor, dan total pertanyaan
    saveHistory() {
        const record = {
            date: new Date().toLocaleString(), // Tanggal dan waktu saat ini
            score: this.score, // Skor saat ini
            total: this.questions.length // Total pertanyaan
        };
        this.history.push(record); // Tambah ke riwayat
        localStorage.setItem('quizHistory', JSON.stringify(this.history)); // Simpan ke localStorage
    }

    // Memuat riwayat skor dari localStorage, jika tidak ada kembalikan array kosong
    loadHistory() {
        const history = localStorage.getItem('quizHistory');
        return history ? JSON.parse(history) : [];
    }

    // Mereset quiz ke kondisi awal untuk memulai ulang
    reset() {
        this.currentIndex = 0; // Reset indeks pertanyaan
        this.score = 0; // Reset skor
        this.questions = []; // Kosongkan daftar pertanyaan
    }
}

// Mengambil elemen-elemen DOM yang digunakan dalam quiz
const questionEl = document.getElementById('question'); // Elemen untuk menampilkan pertanyaan
const answersEl = document.getElementById('answers'); // Elemen untuk menampilkan pilihan jawaban
const feedbackEl = document.getElementById('feedback'); // Elemen untuk menampilkan feedback jawaban
const nextBtn = document.getElementById('next-btn'); // Tombol untuk lanjut ke pertanyaan berikutnya
const resultContainer = document.getElementById('result-container'); // Container hasil akhir quiz
const scoreEl = document.getElementById('score'); // Elemen untuk menampilkan skor akhir
const historyList = document.getElementById('history-list'); // Elemen daftar riwayat skor
const restartBtn = document.getElementById('restart-btn'); // Tombol untuk memulai ulang quiz
const quizContainer = document.getElementById('quiz-container'); // Container utama quiz

const quiz = new Quiz(); // Membuat instance baru dari kelas Quiz

// Fungsi untuk memulai quiz, mereset data dan menampilkan pertanyaan pertama
async function startQuiz() {
    quiz.reset(); // Reset quiz ke kondisi awal
    quizContainer.classList.remove('hidden'); // Tampilkan container quiz
    resultContainer.classList.add('hidden'); // Sembunyikan container hasil
    feedbackEl.textContent = ''; // Kosongkan feedback
    nextBtn.disabled = true; // Nonaktifkan tombol next
    await quiz.fetchQuestions(); // Ambil pertanyaan quiz
    renderQuestion(); // Tampilkan pertanyaan pertama
}

// Fungsi untuk menampilkan pertanyaan dan pilihan jawaban ke halaman
function renderQuestion() {
    const currentQuestion = quiz.getCurrentQuestion(); // Ambil pertanyaan saat ini
    if (!currentQuestion) return; // Jika tidak ada pertanyaan, keluar fungsi
    questionEl.textContent = currentQuestion.question; // Tampilkan teks pertanyaan
    answersEl.innerHTML = ''; // Kosongkan pilihan jawaban sebelumnya
    feedbackEl.textContent = ''; // Kosongkan feedback
    nextBtn.disabled = true; // Nonaktifkan tombol next sampai jawaban dipilih

    // Buat tombol untuk setiap pilihan jawaban
    currentQuestion.answers.forEach(answer => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn'; // Tambahkan kelas CSS
        btn.textContent = answer; // Tampilkan teks jawaban
        btn.addEventListener('click', () => selectAnswer(btn, answer)); // Tambah event listener klik
        answersEl.appendChild(btn); // Tambahkan tombol ke container jawaban
    });
}

// Fungsi yang dijalankan saat pengguna memilih jawaban
function selectAnswer(button, answer) {
    const correct = quiz.answerCurrentQuestion(answer); // Cek jawaban benar atau salah
    // Nonaktifkan semua tombol jawaban dan beri warna sesuai benar/salah
    Array.from(answersEl.children).forEach(btn => {
        btn.disabled = true; // Nonaktifkan tombol
        if (btn.textContent === quiz.getCurrentQuestion().correctAnswer) {
            btn.classList.add('correct'); // Tandai jawaban benar
        } else if (btn === button && !correct) {
            btn.classList.add('incorrect'); // Tandai jawaban salah yang dipilih
        }
    });
    // Tampilkan feedback jawaban
    feedbackEl.textContent = correct ? 'Jawaban Anda benar!' : 'Jawaban Anda salah.';
    nextBtn.disabled = false; // Aktifkan tombol next
}

// Fungsi untuk menampilkan hasil akhir quiz dan riwayat skor
function showResult() {
    quizContainer.classList.add('hidden'); // Sembunyikan container quiz
    resultContainer.classList.remove('hidden'); // Tampilkan container hasil
    scoreEl.textContent = `${quiz.score} / ${quiz.questions.length}`; // Tampilkan skor akhir
    quiz.saveHistory(); // Simpan riwayat skor
    renderHistory(); // Tampilkan riwayat skor
}

// Fungsi untuk menampilkan riwayat skor ke halaman
function renderHistory() {
    historyList.innerHTML = ''; // Kosongkan daftar riwayat
    // Tampilkan riwayat skor terbaru di atas
    quiz.history.slice().reverse().forEach(record => {
        const li = document.createElement('li');
        li.textContent = `${record.date} - Skor: ${record.score} / ${record.total}`;
        historyList.appendChild(li);
    });
}

// Event listener untuk tombol next, lanjut ke pertanyaan berikutnya atau tampilkan hasil jika selesai
nextBtn.addEventListener('click', () => {
    quiz.nextQuestion(); // Naikkan indeks pertanyaan
    if (quiz.isFinished()) {
        showResult(); // Tampilkan hasil jika quiz selesai
    } else {
        renderQuestion(); // Tampilkan pertanyaan berikutnya
    }
});

// Event listener untuk tombol restart, mulai ulang quiz
restartBtn.addEventListener('click', () => {
    startQuiz();
});

// Mulai quiz saat halaman dimuat
startQuiz();
