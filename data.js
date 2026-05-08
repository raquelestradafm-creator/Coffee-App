export const MACHINE_OPTIONS = ["Italiana", "Automática", "Chemex"];
export const COFFEE_OPTIONS = ["Molido", "En grano"];
export const PEOPLE_OPTIONS = ["1 persona", "2 personas"];
export const PRESSURE_OPTIONS = ["Baja", "Media", "Alta", "Personalizada"];
export const QUICK_RESULTS = [
  "Delicioso",
  "Rico",
  "Normal",
  "Ácido",
  "Amargo",
  "Aguado",
  "Muy fuerte",
  "Repetiría",
  "No repetiría"
];

export const emptyForm = () => ({
  date: new Date().toISOString().slice(0, 10),
  machine: "",
  coffeeType: "",
  people: "",
  brand: "",
  pressure: "",
  customBars: "",
  grams: "",
  overall: 0,
  sweetness: 3,
  acidity: 3,
  bitterness: 3,
  body: 3,
  balance: 3,
  quickResults: [],
  note: ""
});
