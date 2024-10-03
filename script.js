document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('transaction-form');
    const typeField = document.getElementById('type');
    const categoryField = document.getElementById('category');
    const amountField = document.getElementById('amount');
    const transactionList = document.getElementById('transaction-list');
    const presetButtons = document.querySelectorAll('.preset-btn');

    // ฟังก์ชันสำหรับการตั้งค่าปุ่ม preset
    presetButtons.forEach(button => {
        button.addEventListener('click', function () {
            amountField.value = this.value;
        });
    });

    // การปรับเปลี่ยนประเภทอัตโนมัติตามหมวดหมู่ที่เลือก
    categoryField.addEventListener('change', function () {
        const category = categoryField.value;
        if (category.includes('ข้าว') || category.includes('ค่า')) {
            typeField.value = 'รายจ่าย';
        } else {
            typeField.value = 'รายรับ';
        }
    });

    // ฟังก์ชันการบันทึกธุรกรรม
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const type = typeField.value;
        const category = categoryField.value;
        const amount = amountField.value;

        if (amount && type && category) {
            saveTransaction(type, category, amount);
            form.reset();  // ล้างฟอร์มหลังการบันทึก
        }
    });

    // ฟังก์ชันบันทึกข้อมูลธุรกรรม
    function saveTransaction(type, category, amount) {
        const now = new Date();
        // กำหนดรูปแบบวันที่เป็นภาษาไทย และเวลาเป็น en-US เพื่อแสดง A.M./P.M.
        const dateString = now.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const timeString = now.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true // แสดงเวลาในรูปแบบ 12 ชั่วโมง พร้อม A.M./P.M.
        }).replace("AM", "A.M.").replace("PM", "P.M.");

        const transaction = {
            type,
            category,
            amount,
            dateTime: `${dateString} ${timeString}` // รวมวันที่และเวลาเข้าด้วยกัน
        };

        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        renderTransactions();
    }

    // ฟังก์ชันแสดงผลรายการธุรกรรม
    function renderTransactions() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactionList.innerHTML = ''; // เคลียร์รายการเก่าออกก่อน

        transactions.forEach((transaction, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.type}</td>
                <td>${transaction.category}</td>
                <td>${transaction.amount}</td>
                <td>${transaction.dateTime}</td>
                <td><button class="delete-btn" data-index="${index}">ลบ</button></td>
            `;
            transactionList.appendChild(row);
        });

        // เพิ่มฟังก์ชันลบรายการ
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                deleteTransaction(index);
            });
        });
    }

    // ฟังก์ชันลบรายการธุรกรรม
    function deleteTransaction(index) {
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.splice(index, 1);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        renderTransactions();
    }

    // โหลดรายการเมื่อเปิดหน้าเว็บ
    renderTransactions();
});
