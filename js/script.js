document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebarContent = document.querySelector('.sidebar-content');
    const blogGrid = document.getElementById('blog-posts');
    const recentPosts = document.getElementById('recent-posts');
    const categoryLinks = document.querySelectorAll('[data-category]');
    const blogCards = document.querySelectorAll('.blog-card');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
            navLinksContainer.classList.remove('active');
        }
    });

    // Mobile dropdown toggle
    if (window.innerWidth <= 768) {
        dropdown.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownContent.style.display = 
                dropdownContent.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Sidebar toggle (if sidebar exists)
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggleBtn = document.querySelector('.sidebar-toggle');
    if (sidebar && sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            // Optionally, toggle icon
            sidebarToggleBtn.textContent = sidebar.classList.contains('active') ? '✖' : '☰';
        });
    }

    // Generic toggle for elements with .toggle-content class and a button with .toggle-btn
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetSelector = btn.getAttribute('data-target');
            if (targetSelector) {
                const target = document.querySelector(targetSelector);
                if (target) {
                    target.classList.toggle('active');
                    // Optionally, update button text
                    btn.textContent = target.classList.contains('active') ? 'Hide' : 'Show';
                }
            }
        });
    });

    // Image mapping for blog categories or titles
    const blogImages = {
        technology: 'images/tech-blog.jpg',
        nature: 'images/nature-blog.jpg',
        food: 'images/food-blog.jpg',
        travel: 'images/travel-blog.jpg',
        health: 'images/health-blog.jpg',
        business: 'images/business-blog.jpg',
        lifestyle: 'images/lifestyle-blog.jpg'
    };

    function getBlogImage(post) {
        // Use the image property from the post (local image path)
        return post.image ? post.image : 'images/default-blog.jpg';
    }

    // Render blog posts
    function renderPosts(posts) {
        blogGrid.innerHTML = posts.map(post => `
            <article class="blog-card">
                <img src="${getBlogImage(post)}" alt="${post.title}">
                <div class="blog-content">
                    <h2>${post.title}</h2>
                    <p>${post.summary}</p>
                    <a href="#" class="read-more">Read More</a>
                </div>
            </article>
        `).join('');

        // Render recent posts in sidebar
        if (recentPosts) {
            recentPosts.innerHTML = posts.slice(0, 3).map(post => `
                <div class="recent-post">
                    <h4>${post.title}</h4>
                    <small>${post.date}</small>
                </div>
            `).join('');
        }
    }

    // Filter posts by category
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            filterPosts(category);
            
            // Close mobile menu after selection
            navLinks.classList.remove('active');
        });
    });

    function filterPosts(category) {
        blogCards.forEach(card => {
            const cardCategory = card.querySelector('.category').textContent.toLowerCase();
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });

        // Update active category in sidebar
        const sidebarLinks = document.querySelectorAll('.sidebar [data-category]');
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.category === category) {
                link.classList.add('active');
            }
        });
    }

    // Navigation and dropdown active state & scroll
    function setActiveLink(links, clicked) {
        links.forEach(link => link.classList.remove('active'));
        if (clicked) clicked.classList.add('active');
    }

    // Handle nav links
    const navLinks = document.querySelectorAll('.nav-links li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            setActiveLink(navLinks, this);
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Handle dropdown links
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            setActiveLink(dropdownLinks, this);
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Make all nav and dropdown links active
    document.querySelectorAll('.nav-links li a, .dropdown-content a, .recent-post-link').forEach(link => {
        link.classList.add('active');
    });

    // Scroll to blog section when "Start Reading" button is clicked
    const startReadingBtn = document.querySelector('.cta-button.primary');
    const blogSection = document.querySelector('.blog-grid');
    if (startReadingBtn && blogSection) {
        startReadingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            blogSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Category filter for dropdown links
    document.querySelectorAll('.dropdown-content a[data-category]').forEach(link => {
        link.addEventListener('click', function(e) {
            const category = this.getAttribute('data-category');
            if (category) {
                e.preventDefault();
                // Show all posts for 'all', otherwise filter by category
                document.querySelectorAll('.blog-card').forEach(card => {
                    let title = card.querySelector('h2')?.textContent?.toLowerCase() || '';
                    let metaCategory = category.toLowerCase();
                    // Map post titles to categories (adjust as needed)
                    const titleCategoryMap = {
                        technology: ['future of ai development', 'tech innovations 2024', 'ai in everyday life'],
                        nature: ['environmental impact', 'wildlife wonders', 'forest conservation'],
                        food: ['culinary adventures', 'healthy breakfast ideas', 'street food around the world'],
                        travel: ['hidden gems of europe', 'backpacking asia', 'travel photography tips'],
                        health: ['wellness journey', 'fitness motivation', 'mental health matters'],
                        business: ['digital marketing trends', 'startup success stories', 'remote work revolution'],
                        lifestyle: ['mindful living', 'home decor trends', 'work-life balance tips']
                    };
                    if (category === 'all' || (titleCategoryMap[metaCategory] && titleCategoryMap[metaCategory].includes(title))) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
                // Scroll to blog section
                const blogSection = document.getElementById('blog');
                if (blogSection) blogSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Initial render
    renderPosts(blogPosts);
});

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
