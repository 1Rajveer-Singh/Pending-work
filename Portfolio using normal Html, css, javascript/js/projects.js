// projects.js

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove "active" class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add "active" class to the clicked button
            this.classList.add('active');

            const selectedCategory = this.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'block';
                    card.classList.add('show');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('show');
                }
            });
        });
    });
});
