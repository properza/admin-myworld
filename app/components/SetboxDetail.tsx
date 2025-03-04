import { useEffect, useState } from "react";
import { useParams } from "@remix-run/react";
import { getCustomerReedeem , GetSetboxesResponse } from "~/models/setbox.server";
import UsernameSection from "./UserNameSection"; // Assuming you have this component to display the user's profile
console.log(getCustomerReedeem);
const SetboxDetail = ({ accessToken }: { accessToken: string }) => {
    const { userId } = useParams(); // Get userId from the URL
    const [setboxData, setSetboxData] = useState<GetSetboxesResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      if (userId) {
        getCustomerReedeem(accessToken, userId)
          .then((data) => {
            setSetboxData(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching setbox data:", error);
            setLoading(false);
          });
      }
    }, [accessToken, userId]);

    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (!setboxData) {
      return <div>Setbox not found.</div>;
    }
  

    return (
        <div className="flex flex-col items-center p-4">
            <div className="flex flex-col items-center mb-4">
                <UsernameSection
                    name={setboxData.customer_name}
                    imageUrl={setboxData.customer_picture}
                />
                <h2 className="text-xl font-semibold">{setboxData.coupon_name}</h2>
                <p className="text-sm text-gray-500">{setboxData.restaurant_name} - {setboxData.restaurant_branch_name}</p>
            </div>
            <div className="w-full max-w-md p-4 border rounded-lg shadow-md bg-white">
                <h3 className="text-lg font-medium">Setbox Details</h3>
                {setboxData.redeem_code ?
                <div className="mt-2">
                    <p><strong>Redeem Code:</strong> {setboxData.redeem_code}</p>
                    <p><strong>Status:</strong> {setboxData.approve_status}</p>
                    <p><strong>Points Used:</strong> {setboxData.point}</p>
                    <p><strong>Expiration Date:</strong> {new Date(setboxData.expired_date).toLocaleDateString()}</p>
                    <p><strong>Used:</strong> {setboxData.is_used ? "Yes" : "No"}</p>
                    <p><strong>Created At:</strong> {new Date(setboxData.created_at).toLocaleString()}</p>
                </div>:
                null}
            </div>
        </div>
    );
};

export default SetboxDetail;
