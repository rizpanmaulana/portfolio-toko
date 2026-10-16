
const produk = [
    {
        nama: "Kaos Basic",
        harga: 75000,
        gambar: "gambar/kaos.jpg",
        kategori: "Pakaian"
    },
    {
        nama: "Hoodie Premium",
        harga: 150000,
        gambar: "gambar/hoodie.jpg",
        kategori: "Pakaian"
    },
    {
        nama: "Celana Cargo",
        harga: 120000,
        gambar: "gambar/cargo.jpg",
        kategori: "Pakaian"
    },
    {
        nama: "Sepatu",
        harga: 170000,
        gambar: "gambar/sepatu.jpg",
        kategori: "Alas kaki"
    },
    {
        nama: "Tas",
        harga: 180000,
        gambar: "gambar/tas.jpg",
        kategori: "Aksesori"
    },
    {
        nama: "Topi",
        harga: 50000,
        gambar: "gambar/topi.jpg",
        kategori: "Aksesori"
    }
];

// ================================
// 1. AMBIL ELEMEN HTML
// ================================

const daftarProduk = document.getElementById("daftar-produk");
const pencarian = document.getElementById("pencarian");
const filterKategori = document.getElementById("filter-kategori");
const urutanHarga = document.getElementById("urutan-harga");
const jumlahProduk = document.getElementById("jumlah-produk");
const hapusPencarian = document.getElementById("hapus-pencarian");

const jumlahKeranjang = document.getElementById("jumlah-keranjang");
const totalBelanja = document.getElementById("total-belanja");
const daftarKeranjang = document.getElementById("daftar-keranjang");
const pesanKeranjangKosong = document.getElementById("keranjang-kosong");

const tombolCheckout = document.getElementById("checkout-wa");
const tombolKosongkan = document.getElementById("kosongkan-keranjang");

// ================================
// 2. AMBIL DATA KERANJANG
// ================================


let keranjang = [];

try {
    const dataTersimpan = JSON.parse(
        localStorage.getItem("keranjang")
    );

    if (Array.isArray(dataTersimpan)) {
        keranjang = dataTersimpan
            .filter(function(item) {
                if (!item || typeof item !== "object") {
                    return false;
                }

                const produkAsli = produk.find(function(p) {
                    return p.nama === item.nama;
                });

                return (
                    produkAsli &&
                    Number.isSafeInteger(item.jumlah) &&
item.jumlah >= 1 &&
item.jumlah <= 99
                );
            })
            .map(function(item) {
                const produkAsli = produk.find(function(p) {
                    return p.nama === item.nama;
                });

                return {
                    ...produkAsli,
                    jumlah: item.jumlah
                };
            });
    }
} catch (error) {
    keranjang = [];
}


// ================================
// 3. TAMPILKAN PRODUK
// ================================

function tampilkanProduk(data) {
    daftarProduk.innerHTML = "";
    jumlahProduk.textContent = data.length + " produk ditemukan";

    if (data.length === 0) {
        daftarProduk.innerHTML = "<p>Produk tidak ditemukan.</p>";
        return;
    }

    data.forEach(function(item) {
        const card = document.createElement("div");
        card.className = "kartu-produk";

        const gambar = document.createElement("img");
        gambar.className = "gambar-produk";
        gambar.src = item.gambar;
        gambar.alt = item.nama;
        gambar.loading = "lazy";

        const info = document.createElement("div");
        info.className = "info-produk";

        const nama = document.createElement("h3");
        nama.textContent = item.nama;

        const harga = document.createElement("p");
        harga.className = "harga-produk";
        harga.textContent = "Rp" + item.harga.toLocaleString("id-ID");

        const tombol = document.createElement("button");
        tombol.className = "tombol-pesan";
        tombol.type = "button";
        tombol.textContent = "Tambah ke Keranjang";

        tombol.addEventListener("click", function() {
            tambahKeranjang(item.nama);
        });

        info.appendChild(nama);
        info.appendChild(harga);
        info.appendChild(tombol);

        card.appendChild(gambar);
        card.appendChild(info);

        daftarProduk.appendChild(card);
    });
}

// ================================
// 4. PENCARIAN, KATEGORI, DAN URUTAN
// ================================

function perbaruiProduk() {
    const kataKunci = pencarian.value.toLowerCase().trim();
    const kategori = filterKategori.value;
    const urutan = urutanHarga.value;

    let hasilFilter = produk.filter(function(item) {
        const cocokNama = item.nama
            .toLowerCase()
            .includes(kataKunci);

        const cocokKategori =
            kategori === "semua" ||
            item.kategori === kategori;

        return cocokNama && cocokKategori;
    });

    if (urutan === "termurah") {
        hasilFilter.sort(function(a, b) {
            return a.harga - b.harga;
        });
    } else if (urutan === "termahal") {
        hasilFilter.sort(function(a, b) {
            return b.harga - a.harga;
        });
    }

    tampilkanProduk(hasilFilter);
}

pencarian.addEventListener("input", function() {
    hapusPencarian.hidden = pencarian.value.length === 0;
    perbaruiProduk();
});

hapusPencarian.addEventListener("click", function() {
    pencarian.value = "";
    hapusPencarian.hidden = true;
    perbaruiProduk();
    pencarian.focus();
});

urutanHarga.addEventListener("change", perbaruiProduk);
filterKategori.addEventListener("change", perbaruiProduk);

// ================================
// 5. TAMBAH BARANG KE KERANJANG
// ================================

function tambahKeranjang(namaProduk) {
    const item = produk.find(function(produk) {
        return produk.nama === namaProduk;
    });

    if (!item) return;

    const itemAda = keranjang.find(function(barang) {
        return barang.nama === namaProduk;
    });

    if (itemAda) {
    if (itemAda.jumlah >= 99) {
        alert("Maksimal 99 unit untuk setiap produk.");
        return;
    }

    itemAda.jumlah += 1;
} else {
    keranjang.push({
        ...item,
        jumlah: 1
    });
    }

    perbaruiKeranjang();
}

// ================================
// 6. PERBARUI TAMPILAN KERANJANG
// ================================


function perbaruiKeranjang() {
    let penyimpananBerhasil = true;

    try {
        localStorage.setItem("keranjang", JSON.stringify(keranjang));
    } catch (error) {
        penyimpananBerhasil = false;
        console.error("Gagal menyimpan keranjang:", error);
    }



    const jumlah = keranjang.reduce(function(hasil, item) {
        return hasil + item.jumlah;
    }, 0);

    const total = keranjang.reduce(function(hasil, item) {
        return hasil + item.harga * item.jumlah;
    }, 0);

    jumlahKeranjang.textContent = jumlah;
    totalBelanja.textContent = "Rp" + total.toLocaleString("id-ID");

    daftarKeranjang.innerHTML = "";

    // Tampilkan pesan jika keranjang kosong
    pesanKeranjangKosong.hidden = keranjang.length > 0;
    if (!penyimpananBerhasil) {
    alert("Keranjang gagal disimpan. Perubahan mungkin hilang setelah halaman dimuat ulang.");
    }

    keranjang.forEach(function(item, index) {
        const li = document.createElement("li");

        const info = document.createElement("span");
        info.textContent =
            item.nama + " × " + item.jumlah +
            " — Rp" +
            (item.harga * item.jumlah).toLocaleString("id-ID");

        const tombolKurang = document.createElement("button");
        tombolKurang.type = "button";
        tombolKurang.textContent = "−";
        tombolKurang.setAttribute("aria-label", "Kurangi " + item.nama);

        tombolKurang.addEventListener("click", function() {
            item.jumlah -= 1;

            if (item.jumlah <= 0) {
                keranjang.splice(index, 1);
            }

            perbaruiKeranjang();
        });

        const tombolTambah = document.createElement("button");
        tombolTambah.type = "button";
        tombolTambah.textContent = "+";
        tombolTambah.setAttribute("aria-label", "Tambah " + item.nama);

tombolTambah.addEventListener("click", function() {
    if (item.jumlah >= 99) {
        alert("Maksimal 99 unit untuk setiap produk.");
        return;
    }

    item.jumlah += 1;
    perbaruiKeranjang();
});
        const tombolHapus = document.createElement("button");
        tombolHapus.type = "button";
        tombolHapus.textContent = "Hapus";

        tombolHapus.addEventListener("click", function() {
            keranjang.splice(index, 1);
            perbaruiKeranjang();
        });

        li.appendChild(info);
        li.appendChild(tombolKurang);
        li.appendChild(tombolTambah);
        li.appendChild(tombolHapus);

        daftarKeranjang.appendChild(li);
    });
}

// ================================
// 7. CHECKOUT WHATSAPP
// ================================


tombolCheckout.addEventListener("click", function() {
    if (keranjang.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    // Validasi produk dan jumlah
    const pesananValid = keranjang.every(function(item) {
        const produkAsli = produk.find(function(p) {
            return p.nama === item.nama;
        });

        return produkAsli &&
            Number.isSafeInteger(item.jumlah) &&
            item.jumlah >= 1 &&
            item.jumlah <= 99;
    });

    if (!pesananValid) {
        alert("Data keranjang tidak valid. Periksa kembali pesanan.");
        return;
    }

    // Gunakan harga dari katalog asli
    const pesanan = keranjang.map(function(item) {
        const produkAsli = produk.find(function(p) {
            return p.nama === item.nama;
        });

        return {
            nama: produkAsli.nama,
            harga: produkAsli.harga,
            jumlah: item.jumlah
        };
    });

    let pesan = "Halo, saya mau pesan:\n\n";

    pesanan.forEach(function(item, index) {
        const subtotal = item.harga * item.jumlah;

        pesan += (index + 1) + ". " +
            item.nama + " × " + item.jumlah +
            " - Rp" + subtotal.toLocaleString("id-ID") + "\n";
    });

    const total = pesanan.reduce(function(hasil, item) {
        return hasil + item.harga * item.jumlah;
    }, 0);

    pesan += "\nTotal: Rp" + total.toLocaleString("id-ID");

    const nomorWA = "6285314870562";
    const url = "https://wa.me/" + nomorWA +
        "?text=" + encodeURIComponent(pesan);

    window.open(url, "_blank");
});

// ================================
// 8. KOSONGKAN SEMUA BARANG
// ================================

tombolKosongkan.addEventListener("click", function() {
    if (keranjang.length === 0) {
        alert("Keranjang sudah kosong!");
        return;
    }

    const yakin = confirm(
        "Yakin ingin menghapus semua barang dari keranjang?"
    );

    if (yakin) {
        keranjang = [];
        perbaruiKeranjang();
    }
});

// ================================
// 9. JALANKAN SAAT HALAMAN DIBUKA
// ================================

perbaruiProduk();
perbaruiKeranjang();