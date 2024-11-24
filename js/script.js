// script.js
async function getRecommendations() {
    const bookTitle = document.getElementById('bookTitle').value.trim();
    if (!bookTitle) {
        alert('Please enter a book title');
        return;
    }

    // Show loading state
    const loadingDiv = document.getElementById('loading');
    const recommendationsDiv = document.getElementById('recommendations');
    loadingDiv.classList.remove('hidden');
    recommendationsDiv.innerHTML = '';

    try {
        // Call your backend API to get recommendations
        const recommendations = await fetchRecommendations(bookTitle);
        
        // Process each recommendation
        const processedRecommendations = await Promise.all(
            recommendations.map(async book => {
                // Get book synopsis and Amazon link
                const bookDetails = await fetchBookDetails(book.title, book.author);
                return {
                    ...book,
                    ...bookDetails
                };
            })
        );

        // Display recommendations
        displayRecommendations(processedRecommendations);
    } catch (error) {
        console.error('Error:', error);
        recommendationsDiv.innerHTML = '<p>Sorry, there was an error getting recommendations. Please try again.</p>';
    } finally {
        loadingDiv.classList.add('hidden');
    }
}

async function fetchRecommendations(title) {
    // Replace this with your actual backend API call
    try {
        const response = await fetch('YOUR_BACKEND_API_ENDPOINT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: title })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    } catch (error) {
        throw new Error('Failed to fetch recommendations');
    }
}

async function fetchBookDetails(title, author) {
    // Replace this with actual API calls to get book synopsis and Amazon link
    // This is a placeholder implementation
    try {
        // Make API calls to get book details
        // You'll need to implement this based on your chosen APIs
        return {
            synopsis: "Book synopsis will be fetched here...",
            amazonLink: `https://www.amazon.com/s?k=${encodeURIComponent(title + ' ' + author)}`
        };
    } catch (error) {
        return {
            synopsis: "Synopsis not available",
            amazonLink: "#"
        };
    }
}

function displayRecommendations(recommendations) {
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '';

    recommendations.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'book-recommendation';
        bookElement.innerHTML = `
            <h2 class="book-title">${book.title}</h2>
            <p class="book-author">by ${book.author}</p>
            <p class="book-synopsis">${book.synopsis}</p>
            <a href="${book.amazonLink}" target="_blank" class="buy-button">
                Buy on Amazon
            </a>
        `;
        recommendationsDiv.appendChild(bookElement);
    });
}
