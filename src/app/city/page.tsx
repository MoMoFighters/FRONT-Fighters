import Academy from "../components/city/buildings/Academy";
import Fashion from "../components/city/buildings/Fashion";
import Food from "../components/city/buildings/Food";
import Gym from "../components/city/buildings/Gym";
import Health from "../components/city/buildings/Health";
import Nothing from "../components/city/buildings/Nothing";
import BusStation from "../components/city/features/BusStation";
import Store from "../components/city/features/Store";
import ToBank from "../components/city/features/ToBank";
import ToHome from "../components/city/features/ToHome";
import ToLibrary from "../components/city/features/ToLibrary";

export default function City() { //내도시
    return (
        <div>
            my city
            <Academy />
            <Food />
            <Gym />
            <Fashion />
            <Health />
            <Nothing />
            <hr />
            <BusStation />
            <ToBank />
            <ToHome />
            <ToLibrary />
            <Store />
        </div>
    );
}