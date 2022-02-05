import './App.css';
import { useEffect, useState } from 'react';

export default function App() {
  const baseUrl = 'https://express-rest-guest-list-api-in.herokuapp.com';
  const [guestList, setGuestList] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getGuestList = async () => {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      setGuestList(allGuests);
      setDisabled(false);
    }
    getGuestList().catch((err) =>
      console.log(err));
      setTimeout(() => {
        setLoading(false)
      }, 3000);
  },);



  async function newGuest() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const createdGuest = await response.json();
    return createdGuest;
  }

  const handleSubmit = (event) => {
    void newGuest();
    event.preventDefault();
  };

  function handleDelete(id) {
    async function deleteGuest() {
      const response = await fetch(`${baseUrl}/guests/${id}`, {
        method: 'DELETE',
      });
      const deletedGuest = await response.json();
      return deletedGuest;
    }
    deleteGuest().catch((err) =>
    console.log(err));
  }

  function handleAttend(id) {
    async function editGuest() {
      const response = await fetch(`${baseUrl}/guests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attending: true }),
      });

      const updatedGuest = await response.json();
      return updatedGuest;
    }
    editGuest().catch((err) =>
    console.log(err));
  }

  return (
    <>
      <section>
        <div>
        <h1>{loading ? ('Loading...') : ''}</h1>
          <h1>Guest List</h1>
          <form onSubmit={handleSubmit}>
            <label>
              First Name:
              <input
                placeholder="enter first name"
                onChange={(event) => setFirstName(event.currentTarget.value)}
                disabled={disabled ? true : false}
              />
            </label>
            <label htmlFor={lastName}>
              Last Name:
              <input
                placeholder="enter last name"
                onChange={(event) => setLastName(event.currentTarget.value)}
                disabled={disabled ? true : false}
              />
            </label>
            <button
              className="addGuestButton"
              disabled={disabled ? true : false}
            >
              Add guest
            </button>
          </form>

        </div>
      </section>

      <section className="listBackground">
        <div>
          <div>
            <h2 className="listHeader">Guests</h2>
            <hr className="hr3" />
            <table>
              <tbody>
                <tr className="extraMarginBottom">
                  <th className="thAlign">First Name</th>
                  <th className="thAlign">Last Name</th>
                  <th>Attending</th>
                  <th>Remove</th>
                </tr>

                {guestList.map((guest) => (
                  <tr key={guest.id}>
                    <td className="tdName">{guest.firstName}</td>
                    <td className="tdName">{guest.lastName}</td>
                    <td>
                      <button
                        className={
                          guest.attending
                            ? 'attendButtonConfirmed'
                            : 'attendButton'
                        }
                        type="button"
                        onClick={() => {
                          handleAttend(guest.id);
                        }}
                      >
                        &#10002;
                      </button>
                    </td>
                    <td>
                      <button
                        className="deleteButton"
                        type="button"
                        onClick={() => handleDelete(guest.id)}
                        id="delete"
                      >
                        x
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
