document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const sortSelect = document.getElementById('sortSelect');
    const templeGrid = document.getElementById('templeGrid');
    
    // Grab all the cards on page load and store them in an array
    const allCards = Array.from(document.querySelectorAll('.news-card'));

    const updateGrid = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const statusTerm = statusFilter.value;
        const sortType = sortSelect.value;

        // 1. FILTERING
        let filteredCards = allCards.filter(card => {
            // Read all text inside the card so users can search by name OR location
            const cardText = card.textContent.toLowerCase();
            const status = card.getAttribute('data-status');

            const matchesSearch = cardText.includes(searchTerm);
            const matchesStatus = statusTerm === 'All' || status === statusTerm;

            return matchesSearch && matchesStatus;
        });

        // 2. SORTING
        filteredCards.sort((a, b) => {
            const nameA = a.getAttribute('data-name');
            const nameB = b.getAttribute('data-name');
            const idA = parseInt(a.getAttribute('data-id'));
            const idB = parseInt(b.getAttribute('data-id'));

            if (sortType === 'name-asc') {
                return nameA.localeCompare(nameB);
            } else if (sortType === 'name-desc') {
                return nameB.localeCompare(nameA);
            } else if (sortType === 'age-old') {
                return idA - idB;
            } else if (sortType === 'age-new') {
                return idB - idA;
            }
        });

        // 3. RENDERING
        // Clear the current grid completely
        templeGrid.innerHTML = '';
        
        // Append only the filtered and sorted cards back into the grid
        filteredCards.forEach(card => {
            templeGrid.appendChild(card);
        });
    };

    // Attach event listeners so the grid updates instantly on any input
    searchInput.addEventListener('input', updateGrid);
    statusFilter.addEventListener('change', updateGrid);
    sortSelect.addEventListener('change', updateGrid);
    
    // Run once on load to ensure initial alphabetical sort applies immediately
    updateGrid();
});