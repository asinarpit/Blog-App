import { useAuth } from "../hooks/useAuth"

const Profile = () => {

    const { user } = useAuth();


    return (
        <div className="flex flex-col">

            <p>{user?.name}</p>

        </div>
    )
}

export default Profile;