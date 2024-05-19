document.addEventListener("DOMContentLoaded", function () {
    let bestSellerTableBody; // Variabel untuk menyimpan referensi ke tbody tabel

    const filterForm = document.getElementById("filterForm");

    // Tambahkan event listener untuk setiap perubahan pada dropdown
    filterForm.addEventListener("change", applyFilters);

    // Fungsi untuk mengambil data dan menerapkan filter
    function applyFilters() {
        fetch("data.json")
            .then((response) => response.json())
            .then((data) => {
                const selectedQuarter = document.getElementById("quarters").value;
                const selectedYear = document.getElementById("year").value;
                const selectedCountry = document.getElementById("country").value;
                const selectedCategory = document.getElementById("bikes-category").value;
                const selectedAgeGroup = document.getElementById("age-group").value;
                const selectedGender = document.getElementById("gender").value;

                // Filter data berdasarkan pilihan dropdown
                const filteredData = data.filter((item) => {
                    const itemQuarter = getQuarter(item.Date);

                    return (
                        (selectedQuarter === "All" || itemQuarter === selectedQuarter) &&
                        (selectedYear === "All" || item.Year === selectedYear) &&
                        (selectedCountry === "All" || item.Country === selectedCountry) &&
                        (selectedCategory === "All" || item.Sub_Category === selectedCategory) &&
                        (selectedAgeGroup === "All" || item.Age_Group === selectedAgeGroup) &&
                        (selectedGender === "All" || item.Customer_Gender === selectedGender)
                    );
                });

                // Memproses data yang sudah difilter
                processFilteredData(filteredData);
            })
            .catch((error) => console.error("Error:", error));
    }

    // Fungsi untuk memproses data yang sudah difilter
    function processFilteredData(data) {
        // Mengelompokkan produk berdasarkan jumlah penjualan
        const salesByProduct = {};
        data.forEach((item) => {
            const product = item.Product;
            const sales = parseInt(item.Order_Quantity);
            if (!salesByProduct[product]) {
                salesByProduct[product] = sales;
            } else {
                salesByProduct[product] += sales;
            }
        });

        // Mengurutkan produk dari yang terlaris
        const sortedProducts = Object.keys(salesByProduct).sort((a, b) => salesByProduct[b] - salesByProduct[a]);

        // Menampilkan 10 produk terlaris dalam tabel
        bestSellerTableBody.innerHTML = ""; // Kosongkan isi tabel sebelum menambahkan data baru
        for (let i = 0; i < 10 && i < sortedProducts.length; i++) {
            const product = sortedProducts[i];
            const sales = salesByProduct[product];
            const row = `
                <tr>
                    <td>${product}</td>
                    <td>${sales}</td>
                </tr>
            `;
            bestSellerTableBody.innerHTML += row;
        }
    }

    // Fungsi untuk mendapatkan kuartal dari tanggal
    function getQuarter(dateString) {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        if (month <= 3) {
            return "Quarters 1";
        } else if (month <= 6) {
            return "Quarters 2";
        } else if (month <= 9) {
            return "Quarters 3";
        } else {
            return "Quarters 4";
        }
    }

    // Mengambil referensi ke tbody tabel
    bestSellerTableBody = document.getElementById("tableBestSeller");

    // Panggil applyFilters saat halaman pertama kali dimuat
    applyFilters();
});
