// import axios from "axios";
// import { useEffect, useState } from "react";
// import { getUsername } from '../helper/helper'

// axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


// /** custom hook */
// export default function useFetch(query){
//     const [getData, setData] = useState({ isLoading : false, apiData: undefined, status: null, serverError: null })

//     useEffect(() => {

//         const fetchData = async () => {
//             try {
//                 setData(prev => ({ ...prev, isLoading: true}));

//                 const { username } = !query ? await getUsername() : '';
                
//                 const { data, status } = !query ? await axios.get(`/api/user/${username}`) : await axios.get(`/api/${query}`);

//                 if(status === 201){
//                     setData(prev => ({ ...prev, isLoading: false}));
//                     setData(prev => ({ ...prev, apiData : data, status: status }));
//                 }

//                 setData(prev => ({ ...prev, isLoading: false}));
//             } catch (error) {
//                 setData(prev => ({ ...prev, isLoading: false, serverError: error }))
//             }
//         };
//         fetchData()

//     }, [query]);

//     return [getData, setData];
// }




import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from '../helper/helper'

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


/** custom hook */
export default function useFetch(query){
    const [getData, setData] = useState({ isLoading : false, apiData: undefined, status: null, serverError: null })

    const [username, setUsername] = useState("");
    console.log(username);

    useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       setData(prev => ({ ...prev, isLoading: true }));

    //       const { username: fetchedUsername } = !query ? await getUsername() : {};

    //       setUsername(fetchedUsername);

    //       const { data, status } = !query ? await axios.get(`/api/user/${fetchedUsername}`) : await axios.get(`/api/${query}`);

    //       if (status === 201) {
    //         setData(prev => ({ ...prev, isLoading: false }));
    //         setData(prev => ({ ...prev, apiData: data, status: status }));
    //       }

    //       setData(prev => ({ ...prev, isLoading: false }));
    //     } catch (error) {
    //       setData(prev => ({ ...prev, isLoading: false, serverError: error }));
    //     }
    //   };


    const fetchData = async () => {
        try {
          setData(prev => ({ ...prev, isLoading: true }));
      
          let fetchedUsername;
          if (!query) {
            const { username } = await getUsername();
            fetchedUsername = username;
            setUsername(fetchedUsername);
          }
      
          const { data, status } = !query
            ? await axios.get(`/api/user/${fetchedUsername}`)
            : await axios.get(`/api/${query}`);
      
          if (status === 201) {
            setData(prev => ({ ...prev, isLoading: false }));
            setData(prev => ({ ...prev, apiData: data, status: status }));
          }
      
          setData(prev => ({ ...prev, isLoading: false }));
        } catch (error) {
          setData(prev => ({ ...prev, isLoading: false, serverError: error }));
        }
      };
      fetchData();
    }, [query]);

    return [getData, setData];
}














// const [username, setUsername] = useState("");

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       setData(prev => ({ ...prev, isLoading: true }));

//       const { username: fetchedUsername } = !query ? await getUsername() : {};

//       setUsername(fetchedUsername);

//       const { data, status } = !query ? await axios.get(`/api/user/${fetchedUsername}`) : await axios.get(`/api/${query}`);

//       if (status === 201) {
//         setData(prev => ({ ...prev, isLoading: false }));
//         setData(prev => ({ ...prev, apiData: data, status: status }));
//       }

//       setData(prev => ({ ...prev, isLoading: false }));
//     } catch (error) {
//       setData(prev => ({ ...prev, isLoading: false, serverError: error }));
//     }
//   };
//   fetchData();
// }, [query]);