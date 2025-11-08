// animation.js

document.addEventListener('DOMContentLoaded', function() {
    const timelineBlocks = document.querySelectorAll('.timeline-block');

    const revealOnScroll = () => {
        timelineBlocks.forEach((block, index) => {
            const rect = block.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100 && !block.classList.contains('show')) {
                setTimeout(() => {
                    block.classList.add('show');
                }, index * 320); // 500ms delay between each block
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);
});
