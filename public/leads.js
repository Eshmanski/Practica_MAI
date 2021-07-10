function submitLead(id, scrf) {
  const data = { id };

  return fetch('/leads/submit', {
    method: 'post',
    headers: {
      'X-XSRF-TOKEN': csrf,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(({ id: key }) => {
      const cards = document.querySelectorAll('#toDoCard');

      let card;
      cards.forEach($el => {
        if ($el.dataset.key === key) {
          card = $el
        }
      });
      
      const col = document.getElementById('inProgressCol');

      card.querySelector('#cardActions').innerHTML = 
      `
      <div class="row-buttons">
        <button data-csrf="${csrf}" data-id="${id} id="doneLead" class="btn btn-prymary" type="button">Выполнено</button>
      </div>
      `;

      col.append(card);
    });
}

function doneLead(id, csrf) {
  const data = { id };

  return fetch('/leads/done', {
    method: 'post',
    headers: {
      'X-XSRF-TOKEN': csrf,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(({ id: key }) => {
      const cards = document.querySelectorAll('#inProgressCard');

      let card;
      cards.forEach($el => {
        if ($el.dataset.key === key) {
          card = $el
        }
      });
      
      const col = document.getElementById('doneCol');

      card.querySelector('#cardActions').remove();

      col.append(card);
    });
}

function deleteLead(id, csrf) {
  return fetch('/leads/remove/' + id, {
    method: 'delete',
    headers: {
      'X-XSRF-TOKEN': csrf
    }
  })
    .then(res => res.json())
    .then(({ id: key }) => {
      const cards = document.querySelectorAll('#toDoCard');

      let card;
      cards.forEach($el => {
        if ($el.dataset.key === key) {
          $el.remove();
        }
      });
    });
}

const submitLeadBtn = document.querySelectorAll('#submitLead');
const doneLeadBtn = document.querySelectorAll('#doneLead');
const deleteLeadBtn = document.querySelectorAll('#deleteLead');


submitLeadBtn.forEach($el => {
    $el.addEventListener('click', async (event) => {
      const id = event.target.dataset.id;
      const csrf = event.target.dataset.csrf;

      await submitLead(id, csrf);
    });
});

doneLeadBtn.forEach($el => {
  $el.addEventListener('click', async (event) => {
    const id = event.target.dataset.id;
    const csrf = event.target.dataset.csrf;

    await doneLead(id, csrf);
  });
});

deleteLeadBtn.forEach($el => {
  $el.addEventListener('click', async (event) => {
    const id = event.target.dataset.id;
    const csrf = event.target.dataset.csrf;

    await deleteLead(id, csrf);
  });
});
