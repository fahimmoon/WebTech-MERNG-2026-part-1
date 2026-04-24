ajax.get({
    url: '/api/list',
    success(response) {
        document.querySelector('#list').innerHTML = response;
    },
    error() {
        document.body.innerHTML = '<p>Unable to load content.</p>';
    }
});

function editMarks(regno) {
    const row = document.querySelector(`tr[data-regno="${regno}"]`);
    const name = row.children[1].innerText;

    ajax.get({
        url: `/api/student-marks/${regno}`,
        success(response) {
            const data = JSON.parse(response);
            document.getElementById('modal-regno').innerText = regno;
            document.getElementById('modal-name').innerText = name;
            const container = document.getElementById('marks-inputs');
            container.innerHTML = '';
            
            data.marks.forEach(mark => {
                const headName = mark.head_info ? mark.head_info.headname : `Head ${mark.hid}`;
                const maxMarks = mark.head_info ? mark.head_info.total : '?';
                container.innerHTML += `
                    <tr>
                        <th style="text-align:right; padding:5px; background:#f9f9f9; width:40%;">${headName} :</th>
                        <td style="padding:5px;">
                            <input type="number" step="0.01" value="${mark.marks}" data-mid="${mark.mid}" class="mark-input" style="width: 60px; padding: 2px;">
                            / ${maxMarks}
                        </td>
                    </tr>
                `;
            });
            
            document.getElementById('edit-modal').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        }
    });
}

function saveMarks() {
    const regno = document.getElementById('modal-regno').innerText;
    const inputs = document.querySelectorAll('.mark-input');
    const updates = Array.from(inputs).map(input => ({
        mid: parseInt(input.getAttribute('data-mid')),
        marks: parseFloat(input.value)
    }));

    ajax.post({
        url: '/api/update-marks',
        data: { regno, updates },
        success(response) {
            const result = JSON.parse(response);
            closeModal();
            // Refetch the list content via AJAX instead of full reload for smoother CRUD
            ajax.get({
                url: '/api/list',
                success(response) {
                    document.querySelector('#list').innerHTML = response;
                }
            });
        },
        error() {
            alert('Failed to save marks');
        }
    });
}

function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}
