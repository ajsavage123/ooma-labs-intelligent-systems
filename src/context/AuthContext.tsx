import React, { createContext, useContext, useEffect, useReducer } from "react";
import { User, PartnershipApplication, Project, Product, Stage } from "../types";
import { v4 as uuidv4 } from "uuid";

interface State {
  currentUser: User | null;
  users: User[];
  applications: PartnershipApplication[];
  projects: Project[];
  products: Product[];
}

const initialState: State = {
  currentUser: null,
  users: [],
  applications: [],
  projects: [],
  products: [],
};

type Action =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "REGISTER_USER"; payload: User }
  | { type: "SUBMIT_APPLICATION"; payload: PartnershipApplication }
  | { type: "UPDATE_APPLICATION_STATUS"; payload: { id: string; status: "Approved" | "Rejected" } }
  | { type: "UPDATE_USER"; payload: Partial<User> & { id: string } }
  | { type: "ADD_PROJECT"; payload: Project }
  | { type: "UPDATE_PROJECT"; payload: Partial<Project> & { id: string } }
  | { type: "ADD_PRODUCT"; payload: Product };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOGIN":
      return { ...state, currentUser: action.payload };
    case "LOGOUT":
      return { ...state, currentUser: null };
    case "REGISTER_USER":
      return { ...state, users: [...state.users, action.payload] };
    case "SUBMIT_APPLICATION":
      return { ...state, applications: [...state.applications, action.payload] };
    case "UPDATE_APPLICATION_STATUS":
      return {
        ...state,
        applications: state.applications.map((app) =>
          app.id === action.payload.id ? { ...app, status: action.payload.status } : app
        ),
      };
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.payload.id ? { ...u, ...action.payload } : u
        ),
        currentUser:
          state.currentUser && state.currentUser.id === action.payload.id
            ? { ...state.currentUser, ...action.payload }
            : state.currentUser,
      };
    case "ADD_PROJECT":
      return { ...state, projects: [...state.projects, action.payload] };
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      };
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.payload] };
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const stored = localStorage.getItem("ooma_state");
      const base = stored ? JSON.parse(stored) : init;
      // ensure there is an admin user
      if (base.users.length === 0) {
        const admin: User = {
          id: uuidv4(),
          name: "Admin",
          email: "admin@oomalabs.com",
          role: "admin",
          workspace_access: true,
        };
        // Add test partner user
        const testUser: User = {
          id: uuidv4(),
          name: "Test User",
          email: "testuser@ooma.com",
          role: "partner",
          workspace_access: true,
          password: "test1234",
        };
        base.users = [admin, testUser];
        base.currentUser = null;
      }
      return base;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem("ooma_state", JSON.stringify(state));
  }, [state]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// helpers
export function makeUser(name: string, email: string, role: User["role"] = "user") {
  return {
    id: uuidv4(),
    name,
    email,
    role,
    workspace_access: false,
  } as User;
}

export function makeApplication(data: Partial<PartnershipApplication>) {
  return {
    id: uuidv4(),
    name: data.name || "",
    email: data.email || "",
    phoneNumber: data.phoneNumber || "",
    cityCountry: data.cityCountry || "",
    currentProfession: data.currentProfession || "",
    areaOfExpertise: data.areaOfExpertise || "",
    linkedinProfile: data.linkedinProfile || "",
    collaborateIn: data.collaborateIn || "innovations_research",
    organization: data.organization,
    role: data.role,
    status: "Pending",
    submittedAt: new Date().toISOString(),
  } as PartnershipApplication;
}

export function makeProject(data: Partial<Project>) {
  return {
    id: uuidv4(),
    name: data.name || "New Project",
    description: data.description || "",
    owner: data.owner || "",
    teamMembers: data.teamMembers || [],
    stages: data.stages || [],
    currentStageIndex: 0,
    lastUpdated: new Date().toISOString(),
    status: "in_progress",
  } as Project;
}

export function makeProduct(data: Partial<Product>) {
  return {
    id: uuidv4(),
    projectId: data.projectId || "",
    name: data.name || "",
    description: data.description || "",
    launchStatus: data.launchStatus || "",
    team: data.team || [],
  } as Product;
}
