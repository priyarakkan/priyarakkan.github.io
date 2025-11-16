document.addEventListener('DOMContentLoaded', () => {  //It waits until the entire HTML page is fully loaded BEFORE running your JavaScript.
const calendarGrid = document.querySelector('.calendarGrid');
const monthYear = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
let currentDate = new Date();
let selectedDate = null;
// Store events as {'YYYY-MM-DD' : ['Event 1', 'Event 2']}
const events = {};
function renderCalendar() {
    calendarGrid.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthYear.textContent = currentDate.toLocaleString('default', {month: 'short', year: 'numeric' });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Add blank spaces for first week
    for (let i=0; i<firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendarGrid.appendChild(emptyCell);
    }
    // Render days
    for (let day=1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-day');
        dayCell.innerHTML = `<h5>${day}</h5>`;
        const dateStr = `${year}-${String(month + 1). padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        // Highlight today's date
        const todayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        console.log(todayStr);
        if (dateStr === todayStr) {
            dayCell.style.backgroundColor ="#FF4E6A";
            dayCell.style.color="#ddd";
            dayCell.style.borderRadius="8px";
            dayCell.style.fontWeight="bold";
            dayCell.style.fontSize="5rem";
        }
        // Display today's date at top
        const dayName = currentDate.toLocaleString('default', {weekday: 'long'});
        const monthName =currentDate.toLocaleString('default', {month:'long'});
        const dateNum = currentDate.getDate();
        document.querySelector('.currentDateDisplay').innerHTML = `
                                <div class='text-center'>
                                <h2 style='margin:0;'>${dayName}</h2>
                                <h4 style='margin:0;'>${monthName} ${dateNum}</h4>
                                </div>`;

        // Add events if exist
        if (events[dateStr]) {
            events[dateStr].forEach(evt => {
                const evtDiv = document.createElement('div');
                evtDiv.classList.add('event');
                evtDiv.textContent = evt;
                dayCell.appendChild(evtDiv);
            });
        }
        dayCell.addEventListener('click', () => openEventModal(dateStr));
        calendarGrid.appendChild(dayCell);    
    }
     // Make sure grid has 7 columns
    calendarGrid.style.gridTemplateColumns = 'repeat(7, 1fr)';
    
}
function openEventModal(dateStr) {
    selectedDate = dateStr;
    const modal = new bootstrap.Modal(document.getElementById('eventModal'));
    document.getElementById('eventTitle').value = events[dateStr] ? events[dateStr][0] : '';
    document.getElementById('deleteEventBtn').style.display = events[dateStr] ? 'inline-block' : 'none';
    
    modal.show();
}
document.getElementById('saveEventBtn').addEventListener('click', () => {
    const title = document.getElementById('eventTitle').value.trim();
    if (!title) return;
    events[selectedDate] = [title];
    renderCalendar();
    bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
});
document.getElementById('deleteEventBtn').addEventListener('click', () => {
    if (events[selectedDate]) {
        delete events[selectedDate];
    }
    renderCalendar();
    bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
});
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() -1);
    renderCalendar();
});
nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() +1);
    renderCalendar();
});
// Initial render
renderCalendar();
});