// UPDATED COURSE DATA - REPLACE YOUR EXISTING coursesData
const coursesData = {
    python: [
        { id: 1, title: "Python Basics", desc: "Learn print statements and simple commands", details: "Duration: 1.5 hours | Difficulty: Beginner | Topics: 6", unlocked: true },
        { id: 2, title: "Variables & Types", desc: "Understanding variables and data types", details: "Duration: 2 hours | Difficulty: Beginner | Topics: 7", unlocked: false },
        { id: 3, title: "Control Flow", desc: "Master if statements and loops", details: "Duration: 1.5 hours | Difficulty: Beginner | Topics: 6", unlocked: false },
        { id: 4, title: "Functions", desc: "Create reusable code blocks", details: "Duration: 2 hours | Difficulty: Intermediate | Topics: 7", unlocked: false },
        { id: 5, title: "Data Structures", desc: "Work with lists and dictionaries", details: "Duration: 3 hours | Difficulty: Intermediate | Topics: 10", unlocked: false },
        { id: 6, title: "File Handling", desc: "Read and write files in Python", details: "Duration: 2 hours | Difficulty: Intermediate | Topics: 8", unlocked: false }
    ],
    javascript: [
        { id: 1, title: "JS Fundamentals", desc: "Variables, types, and operators", details: "Duration: 2 hours | Difficulty: Beginner | Topics: 9", unlocked: true },
        { id: 2, title: "Functions", desc: "Regular and arrow functions", details: "Duration: 1.5 hours | Difficulty: Beginner | Topics: 7", unlocked: false },
        { id: 3, title: "DOM Manipulation", desc: "Interact with HTML elements", details: "Duration: 2.5 hours | Difficulty: Intermediate | Topics: 8", unlocked: false },
        { id: 4, title: "Events", desc: "Handle user interactions", details: "Duration: 2 hours | Difficulty: Intermediate | Topics: 6", unlocked: false },
        { id: 5, title: "Async JavaScript", desc: "Promises and async/await", details: "Duration: 3 hours | Difficulty: Advanced | Topics: 6", unlocked: false }
    ],
    react: [
        { id: 1, title: "React Basics", desc: "Components and JSX", details: "Duration: 2 hours | Difficulty: Beginner | Topics: 7", unlocked: true },
        { id: 2, title: "State & Props", desc: "Managing component state", details: "Duration: 2.5 hours | Difficulty: Intermediate | Topics: 8", unlocked: false },
        { id: 3, title: "Hooks", desc: "useState, useEffect, and more", details: "Duration: 3 hours | Difficulty: Intermediate | Topics: 9", unlocked: false },
        { id: 4, title: "React Router", desc: "Navigation in React apps", details: "Duration: 2 hours | Difficulty: Intermediate | Topics: 5", unlocked: false },
        { id: 5, title: "Context API", desc: "Global state management", details: "Duration: 2.5 hours | Difficulty: Advanced | Topics: 6", unlocked: false },
        { id: 6, title: "React Performance", desc: "Optimization techniques", details: "Duration: 3 hours | Difficulty: Advanced | Topics: 8", unlocked: false }
    ],
    html: [
        { id: 1, title: "HTML Basics", desc: "Structure web pages", details: "Duration: 1.5 hours | Difficulty: Beginner | Topics: 6", unlocked: true },
        { id: 2, title: "CSS Styling", desc: "Style your pages", details: "Duration: 2.5 hours | Difficulty: Beginner | Topics: 10", unlocked: false },
        { id: 3, title: "Flexbox & Grid", desc: "Modern layouts", details: "Duration: 2 hours | Difficulty: Intermediate | Topics: 7", unlocked: false },
        { id: 4, title: "Responsive Design", desc: "Mobile-first approach", details: "Duration: 2 hours | Difficulty: Intermediate | Topics: 6", unlocked: false },
        { id: 5, title: "CSS Animations", desc: "Create smooth transitions", details: "Duration: 2.5 hours | Difficulty: Intermediate | Topics: 8", unlocked: false },
        { id: 6, title: "Advanced CSS", desc: "Sass, variables, and more", details: "Duration: 3 hours | Difficulty: Advanced | Topics: 9", unlocked: false }
    ],
    java: [
        { id: 1, title: "Java Fundamentals", desc: "Syntax and basic operations", details: "Duration: 2.5 hours | Difficulty: Beginner | Topics: 9", unlocked: true },
        { id: 2, title: "OOP in Java", desc: "Classes and objects", details: "Duration: 3 hours | Difficulty: Intermediate | Topics: 11", unlocked: false },
        { id: 3, title: "Collections", desc: "Lists, sets, and maps", details: "Duration: 2.5 hours | Difficulty: Intermediate | Topics: 8", unlocked: false },
        { id: 4, title: "Exception Handling", desc: "Error handling", details: "Duration: 2 hours | Difficulty: Intermediate | Topics: 6", unlocked: false },
        { id: 5, title: "File I/O", desc: "Reading and writing files", details: "Duration: 2 hours | Difficulty: Intermediate | Topics: 7", unlocked: false },
        { id: 6, title: "Multithreading", desc: "Concurrent programming", details: "Duration: 3 hours | Difficulty: Advanced | Topics: 10", unlocked: false }
    ]
};

        // State
        let currentLanguage = 'python';
        let completedCourses = new Set(JSON.parse(localStorage.getItem('completedCourses') || '[]'));
        let studyStartTime = null;
        let totalStudyTime = parseInt(localStorage.getItem('totalStudyTime') || '0');
        let isStudying = false;
        let studyInterval = null;
        let lastStudyDate = localStorage.getItem('lastStudyDate');
        let streak = parseInt(localStorage.getItem('streak') || '0');
        let longestStreak = parseInt(localStorage.getItem('longestStreak') || '0');
        let currentCourse = null;
        let lessonComplete = false;
        let courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
        let quizAnswers = [];
        let currentQuizQuestions = [];
        let quizAccuracy = 0;

        // Check streak
        const today = new Date().toDateString();
        if (lastStudyDate) {
            const lastDate = new Date(lastStudyDate);
            const daysDiff = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff > 1) {
                showNotification('Streak Lost!', `Your ${streak}-day streak has been reset. Start a new one today!`);
                streak = 0;
                localStorage.setItem('streak', '0');
            }
        }

        // Start study timer
        function startStudyTimer() {
            if (!isStudying) {
                isStudying = true;
                studyStartTime = Date.now() - totalStudyTime;
                
                studyInterval = setInterval(() => {
                    if (isStudying) {
                        totalStudyTime = Date.now() - studyStartTime;
                        const hours = Math.floor(totalStudyTime / (1000 * 60 * 60));
                        const minutes = Math.floor((totalStudyTime % (1000 * 60 * 60)) / (1000 * 60));
                        document.getElementById('studyTime').textContent = `${hours}h ${minutes}m`;
                        localStorage.setItem('totalStudyTime', totalStudyTime);
                    }
                }, 1000);
            }
        }

        // Stop study timer
        function stopStudyTimer() {
            isStudying = false;
            if (studyInterval) {
                clearInterval(studyInterval);
                studyInterval = null;
            }
        }

        // Initialize on load
        window.addEventListener('load', () => {
            const bgGradient = document.getElementById('bgGradient');
            bgGradient.classList.add('loading');
            setTimeout(() => bgGradient.classList.remove('loading'), 2000);
            
            updateStats();
            renderChart();
            
            // Display saved study time
            const hours = Math.floor(totalStudyTime / (1000 * 60 * 60));
            const minutes = Math.floor((totalStudyTime % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('studyTime').textContent = `${hours}h ${minutes}m`;
        });

        // Update stats
        function updateStats() {
            document.getElementById('coursesCompleted').textContent = completedCourses.size;
            document.getElementById('streakCount').textContent = `${streak} days`;
            document.getElementById('streakSubtitle').textContent = streak > 0 ? `Longest: ${longestStreak} days` : 'Start your streak today!';
        }

        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const page = this.dataset.page;
                
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
                document.getElementById(page + 'Page').classList.add('active');
                
                if (window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('active');
                    document.getElementById('sidebarOverlay').classList.remove('active');
                    document.getElementById('hamburger').classList.remove('active');

                    renderChart(); // ADD THIS LINE
                }
            });
            initWidgetIndicators();
        });

        // Hamburger
        const hamburger = document.getElementById('hamburger');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        });

        sidebarOverlay.addEventListener('click', () => {
            hamburger.classList.remove('active');
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });

        // Swipe - REPLACE THE EXISTING SWIPE CODE
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let isSwipingOnWidget = false;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    
    // Check if touch started on widgets grid
    isSwipingOnWidget = e.target.closest('.widgets-grid') !== null;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    const horizontalSwipe = Math.abs(touchEndX - touchStartX);
    const verticalSwipe = Math.abs(touchEndY - touchStartY);
    
    // Only trigger sidebar if:
    // 1. Not swiping on widgets
    // 2. Horizontal swipe is greater than vertical
    // 3. Started from left edge (within 50px)
    if (!isSwipingOnWidget && horizontalSwipe > verticalSwipe) {
        if (touchEndX - touchStartX > 100 && touchStartX < 50) {
            // Swipe right from left edge - open sidebar
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
            hamburger.classList.add('active');
        } else if (touchStartX - touchEndX > 100) {
            // Swipe left - close sidebar
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});

        // Search
        const searchBtn = document.getElementById('searchBtn');
        const searchWrapper = document.getElementById('searchWrapper');
        const searchClose = document.getElementById('searchClose');
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        const mainNav = document.getElementById('mainNav');

        searchBtn.addEventListener('click', () => {
            searchWrapper.classList.add('active');
            mainNav.classList.add('hide');
            searchBtn.style.opacity = '0';
            searchBtn.style.pointerEvents = 'none';
            setTimeout(() => searchInput.focus(), 300);
        });

        searchClose.addEventListener('click', () => {
            searchWrapper.classList.remove('active');
            mainNav.classList.remove('hide');
            searchBtn.style.opacity = '1';
            searchBtn.style.pointerEvents = 'all';
            searchInput.value = '';
            searchResults.style.display = 'none';
        });

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 0) {
                const results = [];
                Object.keys(coursesData).forEach(lang => {
                    coursesData[lang].forEach(course => {
                        if (course.title.toLowerCase().includes(query) || course.desc.toLowerCase().includes(query)) {
                            results.push({ ...course, language: lang });
                        }
                    });
                });
                
                if (results.length > 0) {
                    searchResults.innerHTML = results.slice(0, 6).map(course => `
                        <div class="result-item" onclick="openCourseFromSearch('${course.language}', ${course.id})">
                            <div>
                                <strong>${course.title}</strong><br>
                                <small style="color: var(--text-secondary);">${course.language.toUpperCase()} • ${course.desc}</small>
                            </div>
                        </div>
                    `).join('');
                    searchResults.style.display = 'block';
                } else {
                    searchResults.innerHTML = '<div class="result-item">No courses found</div>';
                    searchResults.style.display = 'block';
                }
            } else {
                searchResults.style.display = 'none';
            }
        });

        // Add widget scroll indicators for mobile
function initWidgetIndicators() {
    if (window.innerWidth <= 768) {
        const widgetsGrid = document.querySelector('.widgets-grid');
        const widgets = document.querySelectorAll('.widget');
        
        // Create indicators
        const indicatorsDiv = document.createElement('div');
        indicatorsDiv.className = 'widget-indicators';
        widgets.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `widget-indicator ${index === 0 ? 'active' : ''}`;
            indicator.dataset.index = index;
            indicatorsDiv.appendChild(indicator);
        });
        widgetsGrid.parentNode.insertBefore(indicatorsDiv, widgetsGrid.nextSibling);
        
        // Update active indicator on scroll
        widgetsGrid.addEventListener('scroll', () => {
            const scrollLeft = widgetsGrid.scrollLeft;
            const widgetWidth = widgets[0].offsetWidth + 15; // width + gap
            const activeIndex = Math.round(scrollLeft / widgetWidth);
            
            document.querySelectorAll('.widget-indicator').forEach((ind, idx) => {
                ind.classList.toggle('active', idx === activeIndex);
            });
        });
        
        // Click indicator to scroll
        document.querySelectorAll('.widget-indicator').forEach(ind => {
            ind.addEventListener('click', () => {
                const index = parseInt(ind.dataset.index);
                const widgetWidth = widgets[0].offsetWidth + 15;
                widgetsGrid.scrollTo({
                    left: widgetWidth * index,
                    behavior: 'smooth'
                });
            });
        });
    }
}

        function openCourseFromSearch(lang, courseId) {
    currentLanguage = lang;
    renderLanguageTabs();
    renderCourses();
    
    searchWrapper.classList.remove('active');
    mainNav.classList.remove('hide');
    searchBtn.style.opacity = '1';
    searchBtn.style.pointerEvents = 'all';
    searchInput.value = '';
    searchResults.classList.remove('show');
    setTimeout(() => {
        searchResults.innerHTML = '';
    }, 400);
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.nav-btn[data-page="learn"]').forEach(b => b.classList.add('active'));
    document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
    document.getElementById('learnPage').classList.add('active');
    
    setTimeout(() => {
        const course = coursesData[lang].find(c => c.id === courseId);
        if (course && course.unlocked) {
            checkCourseProgress(course.title);
        }
    }, 500);
}

        // Language tabs
        function renderLanguageTabs() {
            const container = document.getElementById('languageTabs');
            const languages = Object.keys(coursesData);
            container.innerHTML = languages.map(lang => `
                <div class="tab-btn ${lang === currentLanguage ? 'active' : ''}" data-lang="${lang}">
                    ${lang.charAt(0).toUpperCase() + lang.slice(1)}
                </div>
            `).join('');
            
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentLanguage = this.dataset.lang;
                    renderCourses();
                });
            });
        }

        // 1. FIRST - Define openChatbot function
function openChatbot(courseTitle, continueMode) {
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotTitle = document.getElementById('chatbotTitle');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const quizContainer = document.getElementById('quizContainer');
    const quizTab = document.getElementById('quizTab');
    
    currentCourse = courseTitle;
    lessonComplete = false;
    chatbotTitle.textContent = courseTitle;
    chatbotContainer.classList.add('active');
    
    // Start study timer
    startStudyTimer();
    
    quizTab.classList.remove('unlocked');
    document.querySelectorAll('.chatbot-tab').forEach(t => {
        t.classList.remove('active');
        if (t.dataset.tab === 'learn') t.classList.add('active');
    });
    
    chatbotMessages.style.display = 'block';
    quizContainer.style.display = 'none';
    
    const content = courseContent[courseTitle] || {
        intro: "Welcome to this course!",
        lessons: ["Course content coming soon..."],
        quiz: []
    };
    
    if (continueMode && courseProgress[courseTitle]) {
        // Restore previous messages
        chatbotMessages.innerHTML = courseProgress[courseTitle].messages;
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Continue from where left off
        const currentIndex = courseProgress[courseTitle].currentIndex;
        if (currentIndex < content.lessons.length) {
            setTimeout(() => {
                typeLessonsFrom(content.lessons, currentIndex);
            }, 500);
        } else {
            lessonComplete = true;
            quizTab.classList.add('unlocked');
        }
    } else {
        // Start fresh
        chatbotMessages.innerHTML = '';
        courseProgress[courseTitle] = { messages: '', currentIndex: 0 };
        
        setTimeout(() => {
            typeMessage('AI Tutor', content.intro, () => {
                typeLessonsFrom(content.lessons, 0);
            });
        }, 500);
    }
}

        // REPLACE YOUR checkCourseProgress FUNCTION
function checkCourseProgress(courseTitle) {
    const course = coursesData[currentLanguage].find(c => c.title === courseTitle);
    
    if (!course) return;
    
    // Check if there's saved progress
    const savedProgress = courseProgress[courseTitle];
    
    if (savedProgress && savedProgress.lessonIndex < courseContent[courseTitle].lessons.length) {
        // Show continue/restart dialog
        showContinueDialog(course, savedProgress);
    } else {
        // Start fresh
        startCourse(course, false);
    }
}

        // FIND where you create course cards and UPDATE
function renderCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    if (!coursesGrid) return;
    
    coursesGrid.innerHTML = '';
    const courses = coursesData[currentLanguage];
    
    courses.forEach(course => {
        const progress = courseProgress[course.title];
        const percentage = progress && progress.totalLessons > 0 
            ? Math.round((progress.lessonIndex / progress.totalLessons) * 100) 
            : 0;
        
        const courseCard = document.createElement('div');
        courseCard.className = `course-card ${!course.unlocked ? 'locked' : ''}`;
        courseCard.dataset.locked = !course.unlocked;
        courseCard.dataset.courseTitle = course.title;
        
        courseCard.innerHTML = `
            ${!course.unlocked ? `
                <svg class="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            ` : `
                <svg class="unlock-icon" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
            `}
            <div class="course-number">Course ${course.id}</div>
            ${percentage > 0 && percentage < 100 ? `
                <div class="course-progress-badge">
                    <span>${percentage}% Complete</span>
                </div>
            ` : ''}
            <h3 class="course-title">${course.title}</h3>
            <p class="course-desc">${course.desc}</p>
            <button class="view-details-btn">
                View Details
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            <div class="course-details">
                <div class="detail-item">${course.details}</div>
            </div>
        `;
        
        coursesGrid.appendChild(courseCard);
    });
    
    addCourseEventListeners();
}

// REPLACE YOUR ENTIRE addCourseEventListeners FUNCTION
function addCourseEventListeners() {
    // Handle course card clicks
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking the details button
            if (e.target.closest('.view-details-btn')) {
                return;
            }
            
            const isLocked = this.dataset.locked === 'true';
            const courseTitle = this.dataset.courseTitle;
            
            if (!isLocked) {
                const course = coursesData[currentLanguage].find(c => c.title === courseTitle);
                if (course) {
                    startCourse(course, false);  // THIS IS THE KEY LINE
                }
            } else {
                showNotification('Locked', 'Complete previous courses to unlock this one.');
            }
        });
    });
    
    // Handle view details button clicks
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleDetails(this);
        });
    });
}

        function toggleDetails(btn) {
    const details = btn.nextElementSibling;
    const isOpen = details.classList.contains('open');
    
    // Close all other details first
    document.querySelectorAll('.course-details.open').forEach(d => {
        if (d !== details) {
            d.classList.remove('open');
            const prevBtn = d.previousElementSibling;
            if (prevBtn && prevBtn.classList.contains('view-details-btn')) {
                prevBtn.classList.remove('open');
            }
        }
    });
    
    details.classList.toggle('open');
    btn.classList.toggle('open');
}

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length > 0) {
        const results = [];
        Object.keys(coursesData).forEach(lang => {
            coursesData[lang].forEach(course => {
                if (course.title.toLowerCase().includes(query) || course.desc.toLowerCase().includes(query)) {
                    results.push({ ...course, language: lang });
                }
            });
        });
        
        if (results.length > 0) {
            const resultsHTML = results.slice(0, 6).map((course, index) => {
                const langUpper = course.language.toUpperCase();
                return `
                    <div class="result-item" data-search-lang="${course.language}" data-search-id="${course.id}">
                        <div>
                            <strong>${course.title}</strong><br>
                            <small style="color: var(--text-secondary);">${langUpper} &bull; ${course.desc}</small>
                        </div>
                    </div>
                `;
            }).join('');
            
            searchResults.innerHTML = resultsHTML;
            searchResults.classList.add('show');
            
            // Add click listeners to search results
            document.querySelectorAll('.result-item').forEach(item => {
                item.addEventListener('click', function() {
                    const lang = this.dataset.searchLang;
                    const courseId = parseInt(this.dataset.searchId);
                    openCourseFromSearch(lang, courseId);
                });
            });
        } else {
            searchResults.innerHTML = '<div class="result-item" style="pointer-events: none;">No courses found</div>';
            searchResults.classList.add('show');
        }
    } else {
        searchResults.classList.remove('show');
        setTimeout(() => {
            searchResults.innerHTML = '';
        }, 400);
    }
});

// Fix searchClose
searchClose.addEventListener('click', () => {
    searchWrapper.classList.remove('active');
    mainNav.classList.remove('hide');
    searchBtn.style.opacity = '1';
    searchBtn.style.pointerEvents = 'all';
    searchInput.value = '';
    searchResults.classList.remove('show');
    setTimeout(() => {
        searchResults.innerHTML = '';
    }, 400);
});

// ========== CHATBOT FUNCTIONS - PUT THESE IN THIS ORDER ==========

// 2. SECOND - typeLessonsFrom (uses typeMessage)
function typeLessonsFrom(lessons, startIndex) {
    let lessonIndex = startIndex;
    const typeNext = () => {
        if (lessonIndex < lessons.length) {
            setTimeout(() => {
                typeMessage('AI Tutor', lessons[lessonIndex], () => {
                    lessonIndex++;
                    courseProgress[currentCourse].currentIndex = lessonIndex;
                    courseProgress[currentCourse].messages = document.getElementById('chatbotMessages').innerHTML;
                    localStorage.setItem('courseProgress', JSON.stringify(courseProgress));
                    typeNext();
                });
            }, 1000);
        } else {
            lessonComplete = true;
            const quizTab = document.getElementById('quizTab');
            const learnTab = document.getElementById('learnTab');

            if (quizTab) {
                quizTab.classList.add('unlocked');
            }

            // Ensure learn tab stays unlocked
            if (learnTab) {
                learnTab.classList.add('unlocked');
            }
        }
    };
    typeNext();
}

// 3. THIRD - openChatbot (uses typeMessage and typeLessonsFrom)
function openChatbot(courseTitle, continueMode) {
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotTitle = document.getElementById('chatbotTitle');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const quizContainer = document.getElementById('quizContainer');
    const quizTab = document.getElementById('quizTab');

    currentCourse = courseTitle;
    lessonComplete = false;
    chatbotTitle.textContent = courseTitle;
    chatbotContainer.classList.add('active');

    // Start study timer
    startStudyTimer();

    // Add scroll detection for header
    const chatbotContent = document.querySelector('.chatbot-content');
    const chatbotHeader = document.querySelector('.chatbot-header');
    if (chatbotContent && chatbotHeader) {
        chatbotContent.addEventListener('scroll', function() {
            if (this.scrollTop > 50) {
                chatbotHeader.classList.add('scrolled');
            } else {
                chatbotHeader.classList.remove('scrolled');
            }
        });
    }

    // REPLACE TAB SWITCHING CODE
document.querySelectorAll('.chatbot-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Check if tab is unlocked
        if (!this.classList.contains('unlocked')) {
            showNotification('Locked', 'Complete the learning section first!');
            return;
        }

        // Remove active from all tabs
        document.querySelectorAll('.chatbot-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const tabType = this.dataset.tab;
        const messagesContainer = document.getElementById('chatbotMessages');
        const quizContainer = document.getElementById('quizContainer');

        if (tabType === 'learn') {
            if (messagesContainer) messagesContainer.style.display = 'grid';
            if (quizContainer) quizContainer.style.display = 'none';
        } else if (tabType === 'quiz') {
            if (messagesContainer) messagesContainer.style.display = 'none';
            if (quizContainer) quizContainer.style.display = 'block';
        }
    });
});

    chatbotMessages.style.display = 'block';
    quizContainer.style.display = 'none';
    
    const content = courseContent[courseTitle] || {
        intro: "Welcome to this course!",
        lessons: ["Course content coming soon..."],
        quiz: []
    };
    
    if (continueMode && courseProgress[courseTitle]) {
        // Restore previous messages
        chatbotMessages.innerHTML = courseProgress[courseTitle].messages;
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Continue from where left off
        const currentIndex = courseProgress[courseTitle].currentIndex;
        if (currentIndex < content.lessons.length) {
            setTimeout(() => {
                typeLessonsFrom(content.lessons, currentIndex);
            }, 500);
        } else {
            lessonComplete = true;
            quizTab.classList.add('unlocked');
        }
    } else {
        // Start fresh
        chatbotMessages.innerHTML = '';
        courseProgress[courseTitle] = { messages: '', currentIndex: 0 };
        
        setTimeout(() => {
            typeMessage('AI Tutor', content.intro, () => {
                typeLessonsFrom(content.lessons, 0);
            });
        }, 500);
    }
}

// 5. Chatbot tab listeners (AFTER all functions are defined)
document.querySelectorAll('.chatbot-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        if (!this.classList.contains('unlocked')) return;
        
        document.querySelectorAll('.chatbot-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const tabType = this.dataset.tab;
        if (tabType === 'learn') {
            document.getElementById('chatbotMessages').style.display = 'block';
            document.getElementById('quizContainer').style.display = 'none';
        } else {
            document.getElementById('chatbotMessages').style.display = 'none';
            document.getElementById('quizContainer').style.display = 'block';
            loadQuiz();
        }
    });
});

// REPLACE YOUR loadQuiz FUNCTION
function loadQuiz() {
    if (!currentCourse || !courseContent[currentCourse.title]) return;
    
    const quizContainer = document.getElementById('quizContainer');
    const content = courseContent[currentCourse.title];
    currentQuizQuestions = content.quiz;
    quizAnswers = new Array(currentQuizQuestions.length).fill(null);
    
    quizContainer.innerHTML = '';
    
    currentQuizQuestions.forEach((q, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <div class="question-text">${qIndex + 1}. ${q.question}</div>
            <div class="feedback" id="feedback-${qIndex}"></div>
            ${q.options.map((opt, oIndex) => `
                <div class="option" data-question="${qIndex}" data-option="${oIndex}">
                    <div style="width: 20px; height: 20px; border: 2px solid var(--border-color); border-radius: 50%; flex-shrink: 0;"></div>
                    <span>${opt}</span>
                </div>
            `).join('')}
        `;
        quizContainer.appendChild(questionDiv);
    });
    
    // Add submit button
    const submitBtn = document.createElement('button');
    submitBtn.className = 'submit-quiz-btn';
    submitBtn.textContent = 'Submit Quiz';
    submitBtn.onclick = submitQuiz;
    quizContainer.appendChild(submitBtn);
    
    // Add option click handlers
    document.querySelectorAll('.option').forEach(opt => {
        opt.addEventListener('click', function() {
            const qIndex = parseInt(this.dataset.question);
            const oIndex = parseInt(this.dataset.option);
            const question = currentQuizQuestions[qIndex];
            const feedback = document.getElementById(`feedback-${qIndex}`);
            
            // Remove previous selections for this question
            document.querySelectorAll(`.option[data-question="${qIndex}"]`).forEach(o => {
                o.classList.remove('selected', 'correct', 'incorrect');
            });
            
            this.classList.add('selected');
            
            // Check answer immediately
            if (oIndex === question.correct) {
                this.classList.add('correct');
                this.classList.remove('incorrect');
                feedback.innerHTML = '';
                quizAnswers[qIndex] = true;
            } else {
                this.classList.add('incorrect');
                feedback.innerHTML = '<span style="color: #ef4444; font-weight: 600; font-size: 0.95rem;">❌ Try Again</span>';
                quizAnswers[qIndex] = false;
            }
        });
    });
}

// REPLACE startCourse FUNCTION
function startCourse(course, skipQuiz = false) {
    currentCourse = course;
    lessonComplete = false;

    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const quizContainer = document.getElementById('quizContainer');
    const learnTab = document.getElementById('learnTab');
    const quizTab = document.getElementById('quizTab');
    const nav = document.querySelector('nav');

    if (!chatbotContainer || !chatbotMessages) {
        console.error('Required elements not found!');
        return;
    }

    chatbotContainer.classList.add('active');
    chatbotMessages.innerHTML = '';

    if (quizContainer) {
        quizContainer.innerHTML = '';
        quizContainer.style.display = 'none';
    }

    // Reset tabs
    document.querySelectorAll('.chatbot-tab').forEach(tab => {
        tab.classList.remove('active', 'unlocked');
    });

    if (learnTab) {
        learnTab.classList.add('active', 'unlocked');
    }

    // Quiz tab stays LOCKED until learning complete
    if (quizTab) {
        quizTab.classList.remove('unlocked');
        if (!skipQuiz) {
            quizTab.style.opacity = '0.5';
            quizTab.style.pointerEvents = 'none';
        }
    }

    chatbotMessages.style.display = 'grid';

    if (nav) {
        nav.classList.add('hide');
    }

    // Add scroll detection for header
    const chatbotContent = document.querySelector('.chatbot-content');
    const chatbotHeader = document.querySelector('.chatbot-header');
    if (chatbotContent && chatbotHeader) {
        chatbotContent.addEventListener('scroll', function() {
            if (this.scrollTop > 50) {
                chatbotHeader.classList.add('scrolled');
            } else {
                chatbotHeader.classList.remove('scrolled');
            }
        });
    }
    
    // Initialize progress tracking
    if (!courseProgress[course.title]) {
        courseProgress[course.title] = {
            lessonIndex: 0,
            totalLessons: courseContent[course.title] ? courseContent[course.title].lessons.length : 0,
            completed: false
        };
    }
    
    // Add progress indicator
    addProgressIndicator(course.title);
    
    if (courseContent[course.title]) {
        const content = courseContent[course.title];
        let index = 0;
        
        typeMessage('AI TUTOR', content.intro, () => {
            const typeNextLesson = () => {
                if (index < content.lessons.length) {
                    typeMessage('AI TUTOR', content.lessons[index], () => {
                        index++;
                        
                        // Update progress
                        courseProgress[course.title].lessonIndex = index;
                        updateProgressIndicator(course.title);
                        localStorage.setItem('courseProgress', JSON.stringify(courseProgress));
                        
                        if (index < content.lessons.length) {
                            setTimeout(typeNextLesson, 500);
                        } else {
                            lessonComplete = true;

                            // UNLOCK QUIZ TAB when learning complete
                            if (!skipQuiz && quizTab) {
                                quizTab.classList.add('unlocked');
                                quizTab.style.opacity = '1';
                                quizTab.style.pointerEvents = 'all';

                                // Ensure learn tab stays unlocked
                                if (learnTab) {
                                    learnTab.classList.add('unlocked');
                                }

                                showNotification('Learning Complete! 🎓', 'Quiz unlocked! Test your knowledge.');
                            }
                            
                            if (!skipQuiz) {
                                loadQuiz();
                            }
                        }
                    });
                }
            };
            setTimeout(typeNextLesson, 800);
        });
    }
    
    startStudyTimer();
}

// ADD PROGRESS INDICATOR FUNCTIONS
function addProgressIndicator(courseTitle) {
    const header = document.querySelector('.chatbot-header');
    if (!header) return;
    
    // Remove existing indicator
    const existing = document.getElementById('progressIndicator');
    if (existing) existing.remove();
    
    const progress = courseProgress[courseTitle] || { lessonIndex: 0, totalLessons: 0 };
    const percentage = progress.totalLessons > 0 ? Math.round((progress.lessonIndex / progress.totalLessons) * 100) : 0;
    
    const indicator = document.createElement('div');
    indicator.id = 'progressIndicator';
    indicator.className = 'progress-indicator';
    indicator.innerHTML = `
        <div class="progress-label">Course Progress</div>
        <div class="progress-value">${percentage}%</div>
    `;
    
    header.appendChild(indicator);
}

function updateProgressIndicator(courseTitle) {
    const indicator = document.getElementById('progressIndicator');
    if (!indicator) return;
    
    const progress = courseProgress[courseTitle];
    const percentage = progress.totalLessons > 0 ? Math.round((progress.lessonIndex / progress.totalLessons) * 100) : 0;
    
    const valueElement = indicator.querySelector('.progress-value');
    if (valueElement) {
        valueElement.textContent = `${percentage}%`;
        valueElement.style.color = percentage === 100 ? '#4ade80' : 'var(--accent-color)';
    }
}

// ADD SUBMIT QUIZ FUNCTION
function submitQuiz() {
    const allAnswered = quizAnswers.every(a => a !== null);
    
    if (!allAnswered) {
        showNotification('Incomplete Quiz', 'Please answer all questions before submitting.');
        return;
    }
    
    const correctAnswers = quizAnswers.filter(a => a === true).length;
    quizAccuracy = Math.round((correctAnswers / quizAnswers.length) * 100);
    
    showCompletionPopup();
}

// ADD COMPLETION POPUP FUNCTION
function showCompletionPopup() {
    const overlay = document.createElement('div');
    overlay.className = 'completion-overlay active';
    overlay.innerHTML = `
        <div class="completion-popup">
            <div class="completion-icon">${quizAccuracy >= 45 ? '🎉' : '📚'}</div>
            <div class="completion-title">${quizAccuracy >= 45 ? 'Congratulations!' : 'Keep Learning!'}</div>
            <div class="completion-accuracy">
                <div class="accuracy-label">Your Accuracy</div>
                <div class="accuracy-value" style="color: ${quizAccuracy >= 45 ? '#4ade80' : '#ef4444'}">${quizAccuracy}%</div>
            </div>
            <div class="completion-message">
                ${quizAccuracy >= 45 
                    ? 'Great job! You\'ve mastered this lesson.' 
                    : 'Don\'t worry! Practice makes perfect.'}
            </div>
            <button class="completion-btn" onclick="handleCompletion(${quizAccuracy})">
                Continue
            </button>
        </div>
    `;
    document.body.appendChild(overlay);
}

// ADD COMPLETION HANDLER
function handleCompletion(accuracy) {
    document.querySelector('.completion-overlay').remove();
    
    if (accuracy >= 45) {
        // Mark course complete and unlock next
        completedCourses.add(currentCourse.title);
        localStorage.setItem('completedCourses', JSON.stringify([...completedCourses]));
        
        const currentLangCourses = coursesData[currentLanguage];
        const currentIndex = currentLangCourses.findIndex(c => c.title === currentCourse.title);
        if (currentIndex < currentLangCourses.length - 1) {
            currentLangCourses[currentIndex + 1].unlocked = true;
        }
        
        updateStreak();
        renderCourses();
        document.getElementById('chatbotContainer').classList.remove('active');
        showNotification('Course Complete! 🎉', `You completed ${currentCourse.title} with ${accuracy}% accuracy!`);
    } else {
        // Go to home and show AI suggestion
        document.getElementById('chatbotContainer').classList.remove('active');
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('homeBtn').classList.add('active');
        document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active'));
        document.getElementById('homePage').classList.add('active');
        
        setTimeout(() => {
            showAISuggestion(currentCourse.title);
        }, 500);
    }
}

// ADD AI SUGGESTION OVAL BUTTON
function showAISuggestion(courseName) {
    const suggestion = document.createElement('div');
    suggestion.className = 'ai-suggestion-oval';
    suggestion.innerHTML = `
        <div class="suggestion-icon">🤖</div>
        <div class="suggestion-text">
            <div class="suggestion-title">AI Recommendation</div>
            <div class="suggestion-desc">Let's review "${courseName}" together</div>
        </div>
    `;
    suggestion.onclick = () => startAIReview(courseName);
    document.body.appendChild(suggestion);
    
    setTimeout(() => suggestion.classList.add('show'), 100);
}

// ADD AI REVIEW FUNCTION
function startAIReview(courseName) {
    document.querySelector('.ai-suggestion-oval').remove();
    showNotification('AI Review Starting', `Nuvia will help you review ${courseName}!`);
    // Start the lesson without quiz
    const course = coursesData[currentLanguage].find(c => c.title === courseName);
    if (course) {
        startCourse(course, true); // true = skip quiz
    }
}

// FIND AND UPDATE YOUR CLOSE CHATBOT HANDLER
document.getElementById('closeChatbot').addEventListener('click', () => {
    document.getElementById('chatbotContainer').classList.remove('active');
    const nav = document.querySelector('nav');
    if (nav) {
        nav.classList.remove('hide'); // ADD THIS LINE
    }
    stopStudyTimer();
});
        function markCourseComplete(courseTitle) {
            completedCourses.add(courseTitle);
            localStorage.setItem('completedCourses', JSON.stringify([...completedCourses]));
            
            // Clear course progress
            delete courseProgress[courseTitle];
            localStorage.setItem('courseProgress', JSON.stringify(courseProgress));
            
            // Update stats
            document.getElementById('coursesCompleted').textContent = completedCourses.size;
            
            // Update streak
            const today = new Date().toDateString();
            if (lastStudyDate !== today) {
                streak++;
                if (streak > longestStreak) {
                    longestStreak = streak;
                    localStorage.setItem('longestStreak', longestStreak);
                }
                localStorage.setItem('streak', streak);
                localStorage.setItem('lastStudyDate', today);
                updateStats();
            }
            
            // Unlock next course
            const currentCourses = coursesData[currentLanguage];
            const currentCourse = currentCourses.find(c => c.title === courseTitle);
            if (currentCourse) {
                const currentIndex = currentCourses.indexOf(currentCourse);
                if (currentIndex < currentCourses.length - 1) {
                    currentCourses[currentIndex + 1].unlocked = true;
                }
            }
            
            renderCourses();
            renderChart();
        }

        document.getElementById('closeChatbot').addEventListener('click', () => {
            document.getElementById('chatbotContainer').classList.remove('active');
            stopStudyTimer();
        });

        // ADD FUNCTION TO UPDATE CHARTS WITH REAL DATA
function renderChart() {
    const chartContainer = document.querySelector('.chart-container');
    if (!chartContainer) return;
    
    chartContainer.innerHTML = '';
    
    // Calculate real stats
    const languages = ['python', 'javascript', 'react', 'html', 'java'];
    const stats = {};
    
    languages.forEach(lang => {
        const courses = coursesData[lang];
        const completed = courses.filter(c => completedCourses.has(c.title)).length;
        const total = courses.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        stats[lang] = percentage;
    });
    
    // Create bars
    Object.keys(stats).forEach(lang => {
        const percentage = stats[lang];
        const barWrapper = document.createElement('div');
        barWrapper.className = 'chart-bar-wrapper';
        
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = `${Math.max(percentage * 3.5, 20)}px`; // Scale up and minimum height
        
        const label = document.createElement('div');
        label.className = 'chart-label';
        label.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
        
        const percentageLabel = document.createElement('div');
        percentageLabel.className = 'chart-percentage';
        percentageLabel.textContent = `${percentage}%`;
        
        bar.appendChild(percentageLabel);
        barWrapper.appendChild(bar);
        barWrapper.appendChild(label);
        chartContainer.appendChild(barWrapper);
    });
}

        function updateChart(language) {
            const chartContainer = document.getElementById('chartContainer');
            const languages = Object.keys(coursesData);
            
            chartContainer.innerHTML = languages.map(lang => {
                const courses = coursesData[lang];
                const completed = courses.filter(c => completedCourses.has(c.title)).length;
                const percentage = Math.round((completed / courses.length) * 100);
                const height = percentage * 2;
                
                return `
                    <div class="chart-bar-wrapper">
                        <div class="chart-bar" style="height: ${height}px; opacity: ${lang === language ? '1' : '0.4'}; filter: ${lang === language ? 'none' : 'grayscale(0.6)'}">
                            <div class="chart-percentage">${percentage}%</div>
                        </div>
                        <div class="chart-label">${lang.charAt(0).toUpperCase() + lang.slice(1)}</div>
                    </div>
                `;
            }).join('');
        }

        // Settings
        document.getElementById('darkModeToggle').addEventListener('click', function() {
            this.classList.toggle('active');
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });

        document.getElementById('notificationsToggle').addEventListener('click', function() {
            this.classList.toggle('active');
        });

        document.getElementById('autoPlayToggle').addEventListener('click', function() {
            this.classList.toggle('active');
        });

        // Load dark mode preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            document.getElementById('darkModeToggle').classList.add('active');
        }

        // Notification
        function showNotification(title, text) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `
                <div class="notification-title">${title}</div>
                <div class="notification-text">${text}</div>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideInRight 0.5s ease-out reverse';
                setTimeout(() => notification.remove(), 500);
            }, 3000);
        }

        // Initialize
        renderLanguageTabs();
        renderCourses();

        // AI EXPLANATION FEATURE
const programmingKeywords = {
    'variable': true, 'variables': true,
    'function': true, 'functions': true,
    'loop': true, 'loops': true,
    'array': true, 'arrays': true,
    'object': true, 'objects': true,
    'string': true, 'strings': true,
    'integer': true, 'int': true,
    'boolean': true, 'bool': true,
    'class': true, 'classes': true,
    'method': true, 'methods': true,
    'parameter': true, 'parameters': true,
    'argument': true, 'arguments': true,
    'const': true, 'let': true, 'var': true,
    'return': true, 'if': true, 'else': true,
    'for': true, 'while': true,
    'component': true, 'components': true,
    'props': true, 'state': true, 'jsx': true,
    'import': true, 'export': true,
    'async': true, 'await': true, 'promise': true,
    'callback': true, 'event': true,
    'api': true, 'json': true, 'html': true,
    'css': true, 'dom': true, 'node': true
};

// Call AI API for explanations with improved fallback
async function getAIExplanation(keyword, context) {
    // Fallback explanations (use immediately if API is not available)
    const fallbacks = {
        'variable': 'Variables are containers that store data values. Think of them as labeled boxes where you can put information and retrieve it later. You can change what\'s inside anytime!',
        'function': 'Functions are reusable blocks of code that perform specific tasks. Like a recipe, you define it once and use it many times. They help keep your code organized!',
        'loop': 'Loops repeat code multiple times automatically. Instead of writing the same code 100 times, a loop does it for you! Common types include for loops and while loops.',
        'array': 'Arrays store multiple values in one variable, organized by index. Think of it as a numbered list where each item has a position starting from 0.',
        'string': 'Strings are sequences of characters representing text. Anything in quotes like "Hello" is a string. You can combine, split, and manipulate them!',
        'object': 'Objects store data as key-value pairs. Like a real object has properties (color, size), code objects have properties you can access and modify.',
        'boolean': 'Booleans represent true or false values. They\'re used in conditions to make decisions in your code, like "if user is logged in, show dashboard".',
        'const': 'Const declares a constant variable that cannot be reassigned. Use it when you want a value to stay the same throughout your program.',
        'let': 'Let declares a block-scoped variable that can be reassigned. It\'s the modern way to create variables that might change.',
        'component': 'Components are reusable pieces of UI in frameworks like React. Think of them as LEGO blocks you can combine to build your interface.',
        'props': 'Props pass data from parent to child components. They\'re like function parameters but for React components, making them flexible and reusable.',
        'jsx': 'JSX lets you write HTML-like code in JavaScript. It makes creating React components more intuitive by combining markup with logic.',
        'state': 'State is data that can change over time in your application. When state changes, your UI automatically updates to reflect the new data.',
        'import': 'Import statements bring in code from other files or libraries. It helps organize code into separate modules that can be reused.',
        'export': 'Export makes functions, objects, or values available to other files. It\'s how you share code between different parts of your application.',
        'async': 'Async functions allow you to write asynchronous code that looks synchronous. They return promises and make handling delayed operations easier.',
        'await': 'Await pauses execution until a promise resolves. It can only be used inside async functions and makes asynchronous code cleaner.',
        'promise': 'Promises represent future values from asynchronous operations. They can be pending, fulfilled, or rejected, helping manage async workflows.',
        'callback': 'Callbacks are functions passed as arguments to other functions. They\'re executed after an operation completes, enabling asynchronous behavior.',
        'event': 'Events are actions that happen in the browser, like clicks or key presses. You can listen for events and run code when they occur.',
        'api': 'APIs (Application Programming Interfaces) let different software systems communicate. They define how to request and receive data between applications.',
        'json': 'JSON (JavaScript Object Notation) is a lightweight data format. It\'s easy for humans to read and write, and easy for machines to parse.',
        'html': 'HTML (HyperText Markup Language) structures web content. It uses tags to define elements like headings, paragraphs, links, and images.',
        'css': 'CSS (Cascading Style Sheets) styles web pages. It controls colors, layouts, fonts, and visual appearance of HTML elements.',
        'dom': 'DOM (Document Object Model) represents HTML as a tree of objects. JavaScript can manipulate the DOM to dynamically change web page content.',
        'node': 'In web development, Node.js is a runtime that lets you run JavaScript outside the browser. It\'s commonly used for building server-side applications.',
        'class': 'Classes are blueprints for creating objects. They define properties and methods that objects created from the class will have.',
        'method': 'Methods are functions that belong to objects or classes. They define behaviors and actions that objects can perform.',
        'parameter': 'Parameters are variables listed in a function definition. They act as placeholders for values that will be passed when the function is called.',
        'argument': 'Arguments are the actual values passed to a function when you call it. They correspond to the parameters in the function definition.',
        'return': 'Return statements send a value back from a function. They end function execution and provide a result to the caller.',
        'if': 'If statements execute code conditionally. They check if a condition is true and run different code based on the result.',
        'else': 'Else provides an alternative when an if condition is false. It runs code when none of the previous conditions are true.',
        'for': 'For loops repeat code a specific number of times. They\'re great when you know how many iterations you need.',
        'while': 'While loops repeat code as long as a condition is true. They\'re useful when you don\'t know how many iterations you\'ll need.',
        'integer': 'Integers are whole numbers without decimal points. They can be positive, negative, or zero.',
        'int': 'Int is short for integer - a whole number without decimal points. Used for counting, indexing, and mathematical operations.',
    };

    // Return fallback explanation immediately (no API call for now)
    return fallbacks[keyword.toLowerCase()] ||
           `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} is an important programming concept that helps you write better code. It\'s commonly used in many programming languages to build efficient and maintainable applications!`;
}

// Highlight keywords in text
function highlightKeywords(text) {
    let highlightedText = text;
    const keywords = Object.keys(programmingKeywords);
    
    // Sort by length (longest first) to avoid partial matches
    keywords.sort((a, b) => b.length - a.length);
    
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
        highlightedText = highlightedText.replace(regex, (match) => {
            return `<span class="keyword-highlight" data-keyword="${match.toLowerCase()}">${match}</span>`;
        });
    });
    
    return highlightedText;
}

// REPLACE showAIPopup FUNCTION - 1.5 SECONDS
function showAIPopup(keyword, element) {
    const overlay = document.getElementById('aiPopupOverlay');
    const popup = document.getElementById('aiPopup');
    const content = document.getElementById('aiPopupContent');
    const closeBtn = document.getElementById('aiPopupClose');

    const rect = element.getBoundingClientRect();
    const popupHeight = 350;
    const popupWidth = Math.min(500, window.innerWidth - 40);

    let top = rect.top - popupHeight - 20;
    let left = rect.left + (rect.width / 2) - (popupWidth / 2);

    if (top < 20) top = rect.bottom + 20;
    if (left < 20) left = 20;
    if (left + popupWidth > window.innerWidth - 20) {
        left = window.innerWidth - popupWidth - 20;
    }

    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    popup.style.maxWidth = `${popupWidth}px`;

    content.innerHTML = `
        <div class="nuvia-thinking">
            <div class="nuvia-name">Nuvia</div>
            <div class="wave-container">
                <div class="wave-line"></div>
                <div class="wave-line"></div>
                <div class="wave-line"></div>
                <div class="wave-line"></div>
                <div class="wave-line"></div>
            </div>
        </div>
    `;

    content.classList.remove('show');
    closeBtn.style.opacity = '0';

    overlay.classList.add('active');
    setTimeout(() => popup.classList.add('active'), 10);

    const contextMessage = element.closest('.message');
    const context = contextMessage ? contextMessage.querySelector('.message-content').textContent.substring(0, 200) : '';

    getAIExplanation(keyword, context).then(explanation => {
        setTimeout(() => {
            content.innerHTML = `<p style="color: var(--text-primary); font-weight: 500;">${explanation}</p>`;
            setTimeout(() => {
                content.classList.add('show');
                closeBtn.style.opacity = '1';
            }, 100);
        }, 1500); // CHANGED TO 1.5 SECONDS
    }).catch(error => {
        setTimeout(() => {
            content.innerHTML = `<p style="color: var(--text-primary); font-weight: 500;">Nuvia couldn't load the explanation right now, but ${keyword} is an important programming concept!</p>`;
            setTimeout(() => {
                content.classList.add('show');
                closeBtn.style.opacity = '1';
            }, 100);
        }, 1500);
    });
}

// Close popup function remains the same
document.getElementById('aiPopupClose').addEventListener('click', () => {
    const overlay = document.getElementById('aiPopupOverlay');
    const popup = document.getElementById('aiPopup');
    
    popup.classList.remove('active');
    setTimeout(() => overlay.classList.remove('active'), 300);
});

document.getElementById('aiPopupOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'aiPopupOverlay') {
        document.getElementById('aiPopupClose').click();
    }
});

// Attach click listeners to keywords
function attachKeywordListeners(container) {
    container.querySelectorAll('.keyword-highlight').forEach(keyword => {
        keyword.addEventListener('click', function(e) {
            e.stopPropagation();
            const keywordText = this.dataset.keyword;
            showAIPopup(keywordText, this);
        });
    });
}

// FIND YOUR typeMessage FUNCTION and UPDATE the code block part
function typeMessage(label, text, callback) {
    const chatbotMessages = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `
        <div class="message-label">${label}</div>
        <div class="message-content"></div>
    `;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    const contentDiv = messageDiv.querySelector('.message-content');
    
    if (text.includes('\n') && (text.includes('=') || text.includes('{') || text.includes('print(') || text.includes('function'))) {
        const parts = text.split('\n\n');
        let partIndex = 0;
        
        const typePart = () => {
            if (partIndex < parts.length) {
                const part = parts[partIndex];
                // CHECK if this part is code
                if (part.includes('=') || part.includes('{') || part.includes('print(') || part.includes('function') || part.includes('//') || part.includes('#')) {
                    // CREATE PROPER CODE BLOCK
                    const codeBlock = document.createElement('div');
                    codeBlock.className = 'code-block';
                    codeBlock.textContent = part;
                    contentDiv.appendChild(codeBlock);
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                    partIndex++;
                    setTimeout(typePart, 100);
                } else {
                    // Regular text typing
                    let charIndex = 0;
                    const span = document.createElement('span');
                    contentDiv.appendChild(span);
                    
                    const typeChar = () => {
                        if (charIndex < part.length) {
                            span.textContent += part[charIndex];
                            charIndex++;
                            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                            setTimeout(typeChar, 5);
                        } else {
                            span.innerHTML = highlightKeywords(span.textContent);
                            attachKeywordListeners(span);
                            contentDiv.innerHTML += '<br><br>';
                            partIndex++;
                            setTimeout(typePart, 100);
                        }
                    };
                    typeChar();
                }
            } else {
                if (callback) callback();
            }
        };
        typePart();
    } else {
        let index = 0;
        const typeChar = () => {
            if (index < text.length) {
                contentDiv.textContent += text[index];
                index++;
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                setTimeout(typeChar, 5);
            } else {
                contentDiv.innerHTML = highlightKeywords(contentDiv.textContent);
                attachKeywordListeners(contentDiv);
                if (callback) callback();
            }
        };
        setTimeout(typeChar, 150);
    }
}

// Attach click listeners to highlighted keywords
function attachKeywordListeners(container) {
    container.querySelectorAll('.keyword-highlight').forEach(keyword => {
        keyword.addEventListener('click', function(e) {
            e.stopPropagation();
            const keywordText = this.dataset.keyword;
            showAIPopup(keywordText, this);
        });
    });
}
