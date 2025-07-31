const jobResults = document.getElementById('jobResults');
const form = document.getElementById('jobSearchForm');

function searchByCategory(category) {
    document.getElementById('keyword').value = category;
    document.getElementById('jobSearchForm').dispatchEvent(new Event('submit'));
}
// Modal handling
document.querySelector('.signin').addEventListener('click', () => {
    openModal('signinModal');
});

document.querySelector('.signup').addEventListener('click', () => {
    openModal('signupModal');
});

function openModal(id) {
    document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Optional: Close modal on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

function fetchJobs(keyword, location, sortBy, filters) {
    toggleLoading(true);

    // EXAMPLE: build your query string based on inputs
    let apiUrl = `https://jsearch.p.rapidapi.com/jobs?search=${keyword}&location=${location}&sort=${sortBy}`;

    if (filters.length > 0) {
        apiUrl += `&filters=${filters.join(',')}`;
    }

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            toggleLoading(false);
            displayJobs(data.jobs);
        })
        .catch(err => {
            toggleLoading(false);
            console.error('Error fetching jobs:', err);
        });
}

// Handle form submission (mocked for now)
document.getElementById('signinForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("Signed in (mock)!");
    closeModal('signinModal');
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("Signed up (mock)!");
    closeModal('signupModal');
});

function toggleLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const keyword = document.getElementById('keyword').value;
    const location = document.getElementById('location').value;

    document.getElementById('jobSearchForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const keyword = document.getElementById('keyword').value;
        const location = document.getElementById('location').value;
        const sortBy = document.getElementById('sort').value;

        // Get all selected filters (like remote/full-time)
        const selectedFilters = Array.from(document.querySelectorAll('.filter-checkbox:checked'))
            .map(checkbox => checkbox.value);

        fetchJobs(keyword, location, sortBy, selectedFilters);
    });

    jobResults.innerHTML = 'Loading jobs...';

    const url = `https://jsearch.p.rapidapi.com/search?query=${keyword} in ${location}&num_pages=1`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '2bef8cc9a5msh464b1e2cef2cbedp11ed62jsn7f68bb946f3c',
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        jobResults.innerHTML = '';
        result.data.slice(0, 5).forEach(job => {
            const card = document.createElement('div');
            card.className = 'job-card';
            card.innerHTML = `
        <h4>${job.job_title}</h4>
        <p><strong>Company:</strong> ${job.employer_name}</p>
        <p><strong>Location:</strong> ${job.job_city || 'Remote'}</p>
        <p><strong>Salary:</strong> ${job.job_min_salary || 'N/A'} - ${job.job_max_salary || 'N/A'} ${job.job_salary_currency || ''}</p>
        <a href="${job.job_apply_link}" target="_blank">Apply Now</a>
      `;
            jobResults.appendChild(card);
        });

    } catch (err) {
        jobResults.innerHTML = '❌ Error loading jobs.';
        console.error(err);
    }
});

