/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js";
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";


const onNavigate = () => {return;};
localStorageMock('Employee');
jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId('icon-window'));
      const windowIcon = screen.getByTestId('icon-window');
      //to-do write expect expression
      //2ième modification
      expect(windowIcon).toBeTruthy();

    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML);
      //3ième Modification
      const antiChrono = (a, b) => ((a < b) ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });
 describe("But it is loading", () => {
    test("Then, Loading page should be rendered", () => {
      document.body.innerHTML = BillsUI({ loading: true });
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    });
  });
  describe("But an error occure", () => {
    test("Then, Error page should be rendered", () => {
      document.body.innerHTML = BillsUI({ error: "oops an error" });
      expect(screen.getAllByText("Erreur")).toBeTruthy();
    });
  });
  describe("And I click on the new bill button", () => {
    test("Then the click new bill handler should be called", () => {  
      document.body.innerHTML = BillsUI({ data: bills });
      const sampleBills = new Bills({ document, onNavigate, mockstore, localStorage });
      sampleBills.handleClickNewBill = jest.fn();
      screen.getByTestId("btn-new-bill").addEventListener("click", sampleBills.handleClickNewBill);
      screen.getByTestId("btn-new-bill").click();
      expect(sampleBills.handleClickNewBill).toBeCalled();
    });
  });
  describe("And I click on the eye icon", () => {
    test("A modal should open", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const sampleBills = new Bills({ document, onNavigate, mockstore, localStorage });
      sampleBills.handleClickIconEye = jest.fn();
      screen.getAllByTestId("icon-eye")[0].click();
      expect(sampleBills.handleClickIconEye).toBeCalled();
    });
    test("Then the modal should display the attached image", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const sampleBills = new Bills({ document, onNavigate, mockstore, localStorage });
      const iconEye = document.querySelector(`div[data-testid="icon-eye"]`);
      $.fn.modal = jest.fn();
      sampleBills.handleClickIconEye(iconEye);
      expect($.fn.modal).toBeCalled();
      expect(document.querySelector(".modal")).toBeTruthy();
    });
  });
});
// test d'intégration GET
 describe("Given I am a user connected as Employee", () => {
    describe("When I am on Bills Page", () => {
        test("fetches bills from mock API GET", async () => {
          const getSpy = jest.spyOn(mockStore, "list");
          const bills = await mockStore.list();
          expect(getSpy).toHaveBeenCalledTimes(1);
          expect(bills.data.length).toBe(8);
        });
        test("fetches bills from an API and fails with 404 message error", async () => {

          mockStore.bills.list.mockImplementationOnce(() => {
            return {
              list : () =>  {
                return Promise.reject(new Error("Erreur 404"));
              }
            };
          });
          window.onNavigate(ROUTES_PATH.Bills);
          await new Promise(process.nextTick);
          const message = await screen.getByText(/Erreur 404/);
          expect(message).toBeTruthy();
        });
    
        test("fetches messages from an API and fails with 500 message error", async () => {
    
          mockStore.bills.list.mockImplementationOnce(() => {
            return {
              list : () =>  {
                return Promise.reject(new Error("Erreur 500"));
              }
            };
          });
    
          window.onNavigate(ROUTES_PATH.Bills);
          await new Promise(process.nextTick);
          const message = await screen.getByText(/Erreur 500/);
          expect(message).toBeTruthy();
        });
      });
  });
