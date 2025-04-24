import { Route, Routes } from 'react-router-dom';
import {
  Home,
  Login,
  Register,
  Cart,
  CreateCategory,
  CreateProduct,
  AuthLayout,
  RootLayout,
  Logout,
  SearchProducts,
  SingleProductPage,
  Products,
  Success,
  CategoryProducts,
} from './pages/index';

const App = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/create-category" element={<CreateCategory />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/products" element={<Products />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/searched-products/:name" element={<SearchProducts />} />
        <Route path="/products/:id" element={<SingleProductPage />} />
        <Route path=":category_name" element={<CategoryProducts />} />
      </Route>
    </Routes>
  );
};

export default App;
