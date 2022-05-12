import { Typeable, getTaggedTypeable } from "./typeable";

interface Term<A> {
  _typeable: Typeable<A>;
  readonly gmap: <B>(tb: Term<B>) => (f: (b: B) => B) => (a: A) => A;
}

const getTerm = <A>(_typeable: Typeable<A>, gmap: Term<A>["gmap"]) => ({
  _typeable,
  gmap,
});

interface Company {
  _tag: "Company";
  ds: Dept[];
}

const C = (ds: Dept[]): Company => ({ _tag: "Company", ds });

const companyTerm: Term<Company> = getTerm(
  getTaggedTypeable("Company"),
  <B>(tb: Term<B>) => (f: (b: B) => B) => (c: Company) => C(c.ds.map(f))
);

interface Dept {
  _tag: "Dept";
  name: Name;
  manager: Manager;
  us: SubUnit[];
}

const D = (name: Name, manager: Manager, us: SubUnit[]): Dept => ({
  _tag: "Dept",
  name,
  manager,
  us,
});

interface PersonUnit {
  _tag: "PersonUnit";
  value: Employee;
}

interface DeptUnit {
  _tag: "DeptUnit";
  value: Dept;
}

type SubUnit = PersonUnit | DeptUnit;

const PU = (value: Employee): PersonUnit => ({ _tag: "PersonUnit", value });
const DU = (value: Dept): DeptUnit => ({ _tag: "DeptUnit", value });

interface Employee {
  _tag: "Employee";
  person: Person;
  salary: Salary;
}

const E = (person: Person, salary: Salary): Employee => ({
  _tag: "Employee",
  person,
  salary,
});

interface Person {
  _tag: "Person";
  name: Name;
  address: Address;
}

const P = (name: Name, address: Address): Person => ({
  _tag: "Person",
  name,
  address,
});

interface Salary {
  _tag: "Salary";
  value: number;
}

const S = (value: number): Salary => ({ _tag: "Salary", value });

type Manager = Employee;
type Name = string;
type Address = string;

const ralf = E(P("Ralf", "Amsterdam"), S(8000));
const joost = E(P("Joost", "Amsterdam"), S(1000));
const marlow = E(P("Malrow", "Cambridge"), S(2000));
const blair = E(P("Blair", "London"), S(100000));

const genCom = C([
  D("Research", ralf, [(PU(joost), PU(marlow))]),
  D("Strategy", blair, []),
]);
