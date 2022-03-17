/**
 * @jest-environment jsdom
 */

import {
  fireEvent,
  screen
} from "@testing-library/dom"
import {
  setLocalStorage
} from "../../setup-jest"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import store from "../app/store.js"
import getBillsMocked from "../__mocks__/getBillsMocked"

// Setup
const onNavigate = () => {
  return
}
setLocalStorage('Employee')
Object.defineProperty(window, "location", {
  value: {
    hash: "#employee/bill/new"
  }
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then the newBill page should be rendered", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
    })
    test("Then a form with nine fields should be rendered", () => {
      document.body.innerHTML = NewBillUI()
      const form = document.querySelector("form")
      expect(form.length).toEqual(9)
    })
    describe("And I upload an image file", () => {
      test("Then the file handler should show a file", () => {
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({
          document,
          onNavigate,
          store: store,
          localStorage: window.localStorage
        })
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
        const inputFile = screen.getByTestId("file")
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile, {
          target: {
            files: [new File(["photoshop.psd"], "photoshop.psd", {
              type: "image/psd"
            })],
          }
        })
        const numberOfFile = screen.getByTestId("file").files.length
        expect(numberOfFile).toEqual(1)
      })
    })
    describe("And I upload a non-image file", () => {
      test("Then the error message should be display", async () => {
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({
          document,
          onNavigate,
          store: store,
          localStorage: window.localStorage
        })
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
        const inputFile = screen.getByTestId("file")
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile, {
          target: {
            files: [new File(["doc.pdf"], "doc.pdf", {
              type: "text/pdf"
            })],
          }
        })
        expect(handleChangeFile).toBeCalled()
        expect(inputFile.files[0].name).toBe("doc.pdf")
      })
    })
    describe("And I submit a valid bill form", () => {
      test('then a bill is created', async () => {
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({
          document,
          onNavigate,
          store: store,
          localStorage: window.localStorage
        })
        const submit = screen.getByTestId('form-new-bill')
        const forBillValid = {
          expenseType: "Transports",
          expenseName: "Vol Paris Londres",
          datePicker: "2022-12-31",
          amount: 100,
          vat: "70",
          pct: 20,
          fileName: "test.jpg",
          fileUrl: "https://github.com/jsr029/Rakotonirina_JeanSebastien_9_04022022/tree/master/Bill-app/Billed-app-FR-Front/src/test.jpg"
        }
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
        newBill.createBill = (newBill) => newBill
        document.querySelector(`select[data-testid="expense-type"]`).value = forBillValid.expenseType
        document.querySelector(`input[data-testid="expense-name"]`).value = forBillValid.expenseName
        document.querySelector(`input[data-testid="datepicker"]`).value = forBillValid.datePicker
        document.querySelector(`input[data-testid="amount"]`).value = forBillValid.amount
        document.querySelector(`input[data-testid="vat"]`).value = forBillValid.vat
        document.querySelector(`input[data-testid="pct"]`).value = forBillValid.pct
        document.querySelector(`textarea[data-testid="commentary"]`).value = forBillValid.commentary
        newBill.fileUrl = forBillValid.fileUrl
        newBill.fileName = forBillValid.fileName
        submit.addEventListener('click', handleSubmit)
        fireEvent.click(submit)
        expect(handleSubmit).toHaveBeenCalled()
      })
    })
  })
})
//Test d'intégration Post
describe('Given I am connected as an employee', () => {
  describe('When I create a new bill', () => {
    test('Add bill to mock API POST', async () => {
      const getSpyPost = jest.spyOn(getBillsMocked, 'post');

      // Init newBill
      const newBill = {
        "id": "qcCK3SzECmaZAGRrHjaC",
        "status": "refused",
        "pct": 20,
        "amount": 200,
        "email": "a@a",
        "name": "test2",
        "vat": "40",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2002-02-02",
        "commentAdmin": "pas la bonne facture",
        "commentary": "test2",
        "type": "Restaurants et bars",
        "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732"
      };
      const bills = await getBillsMocked.post(newBill);

      // getSpyPost must have been called once
      expect(getSpyPost).toHaveBeenCalledTimes(1);
      // The number of bills must be 5 
      expect(bills.data.length).toBe(5);
    });
  })
});