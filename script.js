const addedRepo = document.querySelector('.added-repositories');
const ul = document.querySelector('.search-container__search-placeholder');
const input = document.querySelector('.search-container__search');

let repoArray = [];

const debounce = (fn, ms) => {
   let timeout;
   return function (...arguments) {
      const fnCall = () => {
         fn.apply(this, arguments);
      };
      clearTimeout(timeout);
      timeout = setTimeout(fnCall, ms);
   };
};

const addItem = (item, name, owner, stars) => {
   if (item.parentNode.nodeName === 'UL') {
      item.innerText = null;
      const repo = document.createElement('div');
      repo.classList.add('repo');
      repo.innerText = `Name: ${name} \n Owner: ${owner} \n Stars: ${stars}`;
      item.appendChild(repo);
      const btnClose = document.createElement('button');
      btnClose.innerText = 'Close';
      item.appendChild(btnClose);
      btnClose.addEventListener('click', deleteItem);
      item.style.height = '70px';
      addedRepo.appendChild(item);
      clearUl();
      input.value = '';
   }
};

const deleteItem = (item) => {
   addedRepo.removeChild(item.target.parentNode);
};

const clearUl = () => {
   Array.from(ul.childNodes).forEach((el) => {
      ul.removeChild(el);
   });
};

async function fetchRepository(value) {
   const response = await fetch(`https://api.github.com/search/repositories?q=${value}`);
   const res = await response.json();
   repoArray = res.items.slice(0, 5);
   repoArray.forEach((el) => {
      const li = document.createElement('li');
      li.classList.add('ul-item');
      li.innerText = el.name;
      li.addEventListener('click', (event) =>
         addItem(event.target, el.name, el.owner.login, el.stargazers_count),
      );
      ul.appendChild(li);
      // console.log(li);
   });
}

function getRepository(value) {
   value = value.target.value;
   console.log(value);
   if (value === '') clearUl();
   else {
      if (ul.hasChildNodes()) {
         clearUl();
         fetchRepository(value);
      } else {
         fetchRepository(value);
      }
      // console.log(repoArray);
   }
}

input.addEventListener('keyup', debounce(getRepository, 700));
