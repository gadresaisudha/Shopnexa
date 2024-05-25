import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from './Loader';
import SmallProduct from "../pages/Products/Smallproduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

export const Header =()=>{
    const {data, isLoading, error} =  useGetTopProductsQuery()
    if (isLoading) {
        return <Loader />;
      }
    
      if (error) {
        return <h1>ERROR</h1>;
      }
    
      return (
        <>
          <div className="flex justify-around">
            <div className="xl:block lg:hidden md:hidden:sm:hidden">
              <div className="grid grid-cols-1">
                {data.map((product) => (
                  <div key={product._id}>
                    <SmallProduct product={product} />
                  </div>
                ))}
              </div>
            </div>
            <ProductCarousel/>
          </div>
        </>
      );
    };
export default Header;