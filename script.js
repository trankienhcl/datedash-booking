document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all others
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Close modal when clicking outside
    const modal = document.getElementById('bookingModal');
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeBookingModal();
        }
    });

    // Smooth scrolling with offset for navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Modal Logic
function openBookingModal(packageName, price) {
    const modal = document.getElementById('bookingModal');
    const title = document.getElementById('modalPackageName');
    const priceDisplay = document.getElementById('modalPackagePrice');
    
    title.textContent = 'Booking: ' + packageName;
    priceDisplay.textContent = price;
    
    // Reset form state
    document.getElementById('bookingForm').style.display = 'block';
    document.getElementById('bookingSuccess').style.display = 'none';
    document.getElementById('bookingForm').reset();
    
    modal.classList.add('show');
    
    // Prevent background scrolling and page jump (khựng)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('show');
    
    // allow transition to finish before hiding display
    setTimeout(() => {
        // Restore background scrolling
        document.body.style.paddingRight = '0px';
        document.body.style.overflow = '';
    }, 300);
}

function submitBooking(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang gửi đơn hàng...';
    submitBtn.disabled = true;

    // Lấy thông tin từ form
    const packageName = document.getElementById('modalPackageName').textContent.replace('Booking: ', '');
    const price = document.getElementById('modalPackagePrice').textContent;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const notes = document.getElementById('notes').value;

    const data = {
        packageName: packageName,
        price: price,
        name: name,
        phone: phone,
        date: date,
        notes: notes
    };

    // Đường link API Web App của Google Apps Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwdRzfwkbz66J-7Zo0B3fs-cAFp32qgb99hHoT9HztVYrOvElMRg04_kr_zJPPu5VzG/exec';

    // Gửi request tới Google Sheet
    fetch(scriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        // Show success
        document.getElementById('bookingForm').style.display = 'none';
        document.getElementById('bookingSuccess').style.display = 'block';
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    })
    .catch(error => {
        console.error('Error!', error.message);
        alert('Có lỗi xảy ra khi kết nối. Đơn hàng của bạn chưa được gửi. Vui lòng thử lại!');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}
