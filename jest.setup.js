import "@testing-library/jest-dom";

const instance = {};
jest.mock("@azure/msal-react", () => ({
  useMsal: jest.fn(),
}));
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    const { loader, unoptimized, priority, ...rest } = props;
    return <img {...rest} alt={props.alt} />;
  },
}));

global.window.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

jest.mock("@/services", () => ({
  affiliateGet: jest.fn(),
  accountByAffiliateIdGet: jest.fn(),
  accountByAccountIdGet: jest.fn(),
  affiliateByFondoIdGet: jest.fn(),
  accountByIdentificationNumber: jest.fn(),
}));
