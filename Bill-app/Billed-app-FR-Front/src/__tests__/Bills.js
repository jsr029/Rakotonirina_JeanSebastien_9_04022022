/**
 * @jest-environment jsdom
 */

import {
  screen,
  waitFor,
  fireEvent
} from "@testing-library/dom"
import Bills from "../containers/Bills.js";
import BillsUI from "../views/BillsUI.js"
import {
  bills
} from "../fixtures/bills.js"
import {
  ROUTES,
  ROUTES_PATH
} from "../constants/routes.js";
import {
  localStorageMock
} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/Store.js"
import getBillsMocked from "../__mocks__/getBillsMocked"
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)

// LocalStorage - Employee
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});
window.localStorage.setItem(
  "user",
  JSON.stringify({
    type: "Employee",
  })
);


const pathname = ROUTES_PATH["Bills"];

// Init onNavigate
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({
    pathname
  });
};


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
      })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      const activeIconWindow = windowIcon.classList.contains('active-icon')
      //to-do write expect expression
      expect(activeIconWindow).toBe(true)

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({
        data: bills
      })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => (b.date - a.date)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
  describe("When it is loading", () => {
    test("Then, Loading page should be rendered", () => {
      document.body.innerHTML = BillsUI({
        loading: true
      })
      expect(screen.getAllByText("Loading...")).toBeTruthy()
    })
  })
  describe("When an error occurs", () => {
    test("Then, Error page should be rendered", () => {
      document.body.innerHTML = BillsUI({
        error: "oops an error"
      })
      expect(screen.getAllByText("Erreur")).toBeTruthy()
    })
  })
  describe("And I click on the new bill button", () => {
    test("Then the click new bill handler should be called", async () => {
      // build user interface
      const html = BillsUI({
        data: bills
      });
      document.body.innerHTML = html;

      // Init Bills
      const allBills = new Bills({
        document,
        onNavigate,
        mockstore: null,
        localStorage: window.localStorage,
      });

      // Mock handleClickNewBill
      const handleClickNewBill = jest.fn(allBills.handleClickNewBill);
      // Get button eye in DOM
      const billBtn = screen.getByTestId('btn-new-bill');

      // Add event and fire
      billBtn.addEventListener('click', handleClickNewBill);
      fireEvent.click(billBtn);

      // screen should show Envoyer une note de frais
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy();
    })
  })
  describe("And I click on the eye icon", () => {
    test("A modal should open", () => {
      document.body.innerHTML = BillsUI({
        data: bills
      })
      const sampleBills = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage
      })
      sampleBills.handleClickIconEye = jest.fn()
      screen.getAllByTestId("icon-eye")[0].click()
      expect(sampleBills.handleClickIconEye).toBeCalled()
    })
    test("Then the modal should display the attached image", () => {
      document.body.innerHTML = BillsUI({
        data: bills
      })
      const sampleBills = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage
      })
      const iconEye = document.querySelector(`div[data-testid="icon-eye"]`)
      $.fn.modal = jest.fn()
      sampleBills.handleClickIconEye(iconEye)
      expect($.fn.modal).toBeCalled()
      expect(document.querySelector(".modal")).toBeTruthy()
    })
  })
})
// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      /* écoute la méthode get sur le mockStore*/
      const getSpy = jest.spyOn(getBillsMocked, "get")
      /* appelle la méthode get du store */
      const bills = await getBillsMocked.get()
      /* Vérifie que la méthode get a été appelée une seule fois*/
      expect(getSpy).toHaveBeenCalledTimes(1)
      /* Vérifie qu'à l'issue du get on a bien un array de taille 4 comme dans le mock*/
      expect(bills.data.length).toBe(4)
    })
    describe("When an error occurs on API", () => {
      test("fetches bills from an API and fails with 404 message error", async () => {
        getBillsMocked.get.mockImplementationOnce(() =>
          Promise.reject(new Error("Erreur 404"))
        )
        // on invoque BillsUI avec un objet erreur
        const html = BillsUI({
          error: "Erreur 404"
        })
        document.body.innerHTML = html

        // on recherche sur l'interface si le l'erreur est bien affichée
        const message = await screen.getByText(/Erreur 404/)

        // on teste si le message est bien affiché
        expect(message).toBeTruthy()
      })

      test("fetches messages from an API and fails with 500 message error", async () => {

        getBillsMocked.get.mockImplementationOnce(() =>
          Promise.reject(new Error("Erreur 500"))
        )
        // on invoque BillsUI avec un objet erreur
        const html = BillsUI({
          error: "Erreur 500"
        })
        document.body.innerHTML = html

        // on recherche sur l'interface si le l'erreur est bien affichée
        const message = await screen.getByText(/Erreur 500/)

        // on teste si le message est bien affiché
        expect(message).toBeTruthy()
      })
    })

  })
})