// Daftar nama realistis untuk 50 data pegawai awal
const namaAwal = [
    "Andi Pratama", "Budi Santoso", "Citra Lestari", "Dewi Anggraini", "Eko Saputra",
    "Fitriani Putri", "Gilang Ramadhan", "Hendra Wijaya", "Indah Permata", "Joko Susilo",
    "Kartika Sari", "Lukman Hakim", "Maya Safitri", "Nanda Kusuma", "Oki Setiawan",
    "Putri Maharani", "Qori Aulia", "Rizky Hidayat", "Siti Nurhaliza", "Taufik Ismail",
    "Ulfa Damayanti", "Vino Bastian", "Wulan Guritno", "Xaverius Raga", "Yuni Shara",
    "Zulkifli Hasan", "Agus Salim", "Bella Shofie", "Candra Wijaya", "Dian Sastro",
    "Erwin Gutawa", "Fajar Sadboy", "Gita Gutawa", "Hadi Pranoto", "Intan Nuraini",
    "Johan Budi", "Kiki Amalia", "Lestari Kejora", "Maman Abdurrahman", "Nia Ramadhani",
    "Oscar Lawalata", "Prilly Latuconsina", "Raffi Ahmad", "Sandra Dewi", "Tono Sudirman",
    "Umar Bakri", "Vina Panduwinata", "Wahyu Hidayat", "Yusuf Mansur", "Zaskia Adya"
];

const listDept = ["IT & Sistem Informasi", "Keuangan", "SDM / HRD", "Operasional", "Pemasaran"];
const listJabatan = ["Manajer", "Supervisor", "Staf Senior", "Staf Junior"];

// Generate 50 data pegawai
function generateInitial50() {
    const data = [];
    for (let i = 0; i < 50; i++) {
        const nomor = String(i + 1).padStart(4, '0');
        data.push({
            nip: `19950${nomor}202501`,
            nama: namaAwal[i],
            jk: i % 2 === 0 ? "L" : "P",
            departemen: listDept[i % listDept.length],
            jabatan: listJabatan[i % listJabatan.length],
            status: i % 3 === 0 ? "Kontrak" : "Tetap"
        });
    }
    return data;
}

// Ambil data dari localStorage atau buat baru jika kosong
let dataPegawai = JSON.parse(localStorage.getItem('simpeg_data')) || generateInitial50();
localStorage.setItem('simpeg_data', JSON.stringify(dataPegawai));

// Autentikasi Login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin123') {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('dashboard-section').classList.remove('hidden');
        renderTable();
    } else {
        alert('Username atau Password salah! Gunakan: admin / admin123');
    }
});

function logout() {
    document.getElementById('dashboard-section').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
}

// Render Tabel & Statistik
function renderTable(filteredData = dataPegawai) {
    const tbody = document.getElementById('pegawai-tbody');
    tbody.innerHTML = '';

    filteredData.forEach((pegawai, index) => {
        const originalIndex = dataPegawai.findIndex(p => p.nip === pegawai.nip);
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${pegawai.nip}</td>
                <td>${pegawai.nama}</td>
                <td>${pegawai.jk}</td>
                <td>${pegawai.departemen}</td>
                <td>${pegawai.jabatan}</td>
                <td>${pegawai.status}</td>
                <td>
                    <button class="btn-warning" onclick="editPegawai(${originalIndex})">Edit</button>
                    <button class="btn-danger" onclick="hapusPegawai(${originalIndex})">Hapus</button>
                </td>
            </tr>
        `;
    });

    updateStats();
}

function updateStats() {
    document.getElementById('stat-total').innerText = dataPegawai.length;
    document.getElementById('stat-tetap').innerText = dataPegawai.filter(p => p.status === 'Tetap').length;
    document.getElementById('stat-kontrak').innerText = dataPegawai.filter(p => p.status === 'Kontrak').length;
}

// Pencarian & Filter
function filterTable() {
    const keyword = document.getElementById('search-input').value.toLowerCase();
    const dept = document.getElementById('dept-filter').value;

    const hasil = dataPegawai.filter(p => {
        const cocokNamaNip = p.nama.toLowerCase().includes(keyword) || p.nip.includes(keyword);
        const cocokDept = dept === "" || p.departemen === dept;
        return cocokNamaNip && cocokDept;
    });

    renderTable(hasil);
}

// Modal Tambah & Edit
function openModal(isEdit = false) {
    document.getElementById('pegawai-modal').classList.remove('hidden');
    if (!isEdit) {
        document.getElementById('modal-title').innerText = "Tambah Data Pegawai";
        document.getElementById('pegawai-form').reset();
        document.getElementById('edit-index').value = "";
    }
}

function closeModal() {
    document.getElementById('pegawai-modal').classList.add('hidden');
}

document.getElementById('pegawai-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const editIndex = document.getElementById('edit-index').value;

    const pegawaiBaru = {
        nip: document.getElementById('nip').value,
        nama: document.getElementById('nama').value,
        jk: document.getElementById('jk').value,
        departemen: document.getElementById('departemen').value,
        jabatan: document.getElementById('jabatan').value,
        status: document.getElementById('status').value
    };

    if (editIndex === "") {
        dataPegawai.unshift(pegawaiBaru); // Tambah ke baris paling atas
    } else {
        dataPegawai[editIndex] = pegawaiBaru;
    }

    localStorage.setItem('simpeg_data', JSON.stringify(dataPegawai));
    closeModal();
    renderTable();
});

function editPegawai(index) {
    const p = dataPegawai[index];
    document.getElementById('modal-title').innerText = "Edit Data Pegawai";
    document.getElementById('edit-index').value = index;
    document.getElementById('nip').value = p.nip;
    document.getElementById('nama').value = p.nama;
    document.getElementById('jk').value = p.jk;
    document.getElementById('departemen').value = p.departemen;
    document.getElementById('jabatan').value = p.jabatan;
    document.getElementById('status').value = p.status;
    openModal(true);
}

function hapusPegawai(index) {
    if (confirm(`Yakin ingin menghapus data ${dataPegawai[index].nama}?`)) {
        dataPegawai.splice(index, 1);
        localStorage.setItem('simpeg_data', JSON.stringify(dataPegawai));
        renderTable();
    }
}

function resetData50() {
    if (confirm("Kembalikan ke 50 data pegawai awal?")) {
        dataPegawai = generateInitial50();
        localStorage.setItem('simpeg_data', JSON.stringify(dataPegawai));
        renderTable();
    }
}
