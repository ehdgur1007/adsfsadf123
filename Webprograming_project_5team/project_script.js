var currentYear, currentMonth;
var events = {};

var apiKey = "AIzaSyBdlcRqchayGH2SRcYU_cEiO4PP4jRT_0I";
var calendarId = "ko.south_korea.official%23holiday%40group.v.calendar.google.com";

window.onload = function () {
    var date = new Date();
    currentYear = date.getFullYear();
    currentMonth = date.getMonth() + 1;
    updateCalendar();
    setSeasonalBackground(currentMonth);
}

function setSeasonalBackground(month) {
    var seasons = ["winter", "spring", "summer", "autumn"];
    var season = seasons[Math.floor((month % 12) / 3)];
    document.body.style.backgroundImage = `url('${season}.gif')`;
}

document.getElementById('prevMonth').addEventListener('click', function () {
    currentMonth--;
    if (currentMonth < 1) {
        currentMonth = 12;
        currentYear--;
    }
    updateCalendar();
    setSeasonalBackground(currentMonth);
});

document.getElementById('nextMonth').addEventListener('click', function () {
    currentMonth++;
    if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
    }
    updateCalendar();
    setSeasonalBackground(currentMonth);
});

function updateCalendar() {
    document.getElementById('calendarLabel').textContent = currentYear + '년 ' + currentMonth + '월';

    var startDate = new Date(currentYear, currentMonth - 1).toISOString();
    var endDate = new Date(currentYear, currentMonth).toISOString();

    var url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`
    + `?key=${apiKey}`
    + `&orderBy=startTime`
    + `&singleEvents=true`
    + `&timeMin=${startDate}`
    + `&timeMax=${endDate}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            var holidays = data.items ? data.items.map(item => new Date(item.start.date).getDate()) : [];
            generateCalendar(currentYear, currentMonth, holidays);
        })
        .catch(console.error);
}

function generateCalendar(year, month, holidays) {
    var date = new Date(year, month - 1, 1);
    var daysInMonth = new Date(year, month, 0).getDate();
    var dayOfWeek = date.getDay();
    var calendar = '<table><tr><th class="sunday">일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th class="saturday">토</th></tr><tr>';

    for (var i = 0; i < dayOfWeek; i++) {
        calendar += '<td></td>';
    }

    for (var i = 1; i <= daysInMonth; i++) {
        if (dayOfWeek == 7) {
            dayOfWeek = 0;
            calendar += '</tr><tr>';
        }
        var dayClass = '';
        if (dayOfWeek == 0) {
            dayClass = 'sunday';
        } else if (dayOfWeek == 6) {
            dayClass = 'saturday';
        } else if (holidays.includes(i)) {
            dayClass += 'holiday';
        }

        if (i === new Date().getDate() && currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth() + 1) {
            calendar += '<td class="' + dayClass + ' today" onclick="showEventForm(' + currentYear + ',' + currentMonth + ',' + i + ')">' + i + '</td>';
        } else {
            calendar += '<td class="' + dayClass + '" onclick="showEventForm(' + currentYear + ',' + currentMonth + ',' + i + ')">' + i + '</td>';
        }

        dayOfWeek++;
    }

    while (dayOfWeek < 7) {
        calendar += '<td></td>';
        dayOfWeek++;
    }

    calendar += '</tr></table>';
    $("#calendar").html(calendar);
}

function showEventForm(year, month, day) {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var dateString = year + "년 " + (month < 10 ? '0' : '') + month + "월 " + (day < 10 ? '0' : '') + day + "일";
    document.getElementById('memo-date').value = dateString;
    document.getElementById('memo-time').value = (hours < 10 ? '0' : '') + hours + ":" + (minutes < 10 ? '0' : '') + minutes;
}

const memoForm = document.getElementById("memo-form");
const memoInput = document.getElementById("memo-input");
const memoList = document.getElementById("memo-list");

const memos = JSON.parse(localStorage.getItem("memos")) || [];

renderMemos();

memoForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const memoDate = document.getElementById('memo-date').value;
    const memoTime = document.getElementById('memo-time').value;
    const memoContent = memoInput.value.trim();

    if (memoContent) {
        const memo = {
            id: Date.now(),
            content: memoDate + " " + memoTime + "ㅤㅤㅤㅤㅤㅤㅤㅤㅤ" + memoContent
        };

        memos.push(memo);

        saveMemos();

        memoInput.value = "";

        renderMemos();
    }
});

memoList.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-button")) {
        const memoId = parseInt(
            e.target.parentElement.parentElement.dataset.id
        );
        memos.splice(
            memos.findIndex((memo) => memo.id === memoId),
            1
        );
        saveMemos();

        renderMemos();
    }
});

function renderMemos() {
    memoList.innerHTML = memos.length === 0
        ? "<li>현재 메모가 없습니다.</li>"
        : memos.map(createMemoItem).join('');
}

function createMemoItem(memo) {
    return `
        <li class="memo-item" data-id="${memo.id}">
            <div class="memo-content">${memo.content}</div>
            <div class="memo-actions">
                <span class="delete-button">Delete</span>
            </div>
        </li>
    `;
}

function saveMemos() {
    localStorage.setItem("memos", JSON.stringify(memos));
}
