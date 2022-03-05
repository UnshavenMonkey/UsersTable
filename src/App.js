import React, {useEffect, useState} from "react";
import axios from "axios";
import style from './App.module.css';
import metla from './img/metla.svg';
import X from './img/X.svg';

export function App() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [users, setUsers] = useState([]);
    const [items, setItems] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
       axios.get("https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users")
            .then((result) => {
                    setIsLoaded(true);
                    setUsers(result.data);
                    setItems(result.data);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    const handleSearch = (e) => {
        const search = e.target.value;
        setSearchValue(search);
        const filterList = users.filter((i) => {
            return Object.values(i).toString().includes(search);
        });
        setItems(filterList);
    }

    const handleClearSearch = () => {
        setSearchValue('');
        setItems(users);
    }

    const handleSorted = (e) => {
        const sortedValue = e.target.value;
        const list = items.map((elem, index) => {
            return {index: index, value: elem};
        })
        list.sort((a,b) => {
            if (a.value[sortedValue] > b.value[sortedValue]) {
                return -1;
            }
            if (a.value[sortedValue] < b.value[sortedValue]) {
                return 1;
            }
            return 0;
        })
        const result = list.map((elem) => {
            return items[elem.index];
        })
        setItems(result);
    }

    const handleDeleteItem = (e) => {
        const idItem = e.target.value;
        setItems(items.filter((i) => i.id !== idItem));
    }

    if (error) {
        return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Загрузка...</div>;
    }

    return (
      <div className={style.container}>
          <h3 className={style.headerListUser}>Список пользователей</h3>
          <div className={style.searchWrap}>
              <input value={searchValue} onChange={e => handleSearch(e)} name="search" type="text" className={style.searchInput} placeholder="Поиск по имени или e-mail" />
                  <div className={style.clearSearchFilter}>
                      <button className={style.buttonClearSearch} onClick={handleClearSearch}>
                          <img src={metla} alt="clear" className={style.imgClearSearch} />
                          <p className={style.textClearSearch}>Очистить фильтр</p>
                      </button>
                  </div>
          </div>
          <div className={style.sortedWrap}>
              <p className={style.sortedText}>Сортировка:</p>
              <button className={style.sortedItem} value='registration_date' onClick={e => handleSorted(e)}>Дата регистрации</button>
              <button className={style.sortedItem} value='rating' onClick={e => handleSorted(e)}>Рейтинг</button>
          </div>
          <div className={style.listUsers}>
              <table className={style.tableUsers}>
                  <thead>
                      <tr>
                          <td className={style.tableRow}>Имя пользователя</td>
                          <td className={style.tableRow}>E-mail</td>
                          <td className={style.tableRow}>Дата регистрации</td>
                          <td className={style.tableRow}>Рейтинг</td>
                          <td className={style.tableRow}>&nbsp;</td>
                      </tr>
                  </thead>
                  <tbody>
                  {items.map(item => (
                      <tr key={item.id}>
                          <td className={style.tableRow}>{item.username}</td>
                          <td className={style.tableRow}>{item.email}</td>
                          <td className={style.tableRow}>{item.registration_date}</td>
                          <td className={style.tableRow}>{item.rating}</td>
                          <td className={style.tableRow}><button className={style.deleteButton} value={item.id} onClick={e => handleDeleteItem(e)}/></td>
                      </tr>))}
                  </tbody>
              </table>
          </div>
      </div>
  );
}
