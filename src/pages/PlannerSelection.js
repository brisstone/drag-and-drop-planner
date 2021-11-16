import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useEffect } from "react";
import axios from "axios";
import '../index.css'

const customersJSON = []

const PlannerSelection = () => {

  useEffect(() => {
    fetchData();
   
  }, []);


  const [updatePlanner, setUpdateplanner] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [planner, setPlanner] = useState([]);
  const [error, setError] = useState()

  const [{ isOver }, addToPlannerRef] = useDrop({
    accept: "customer",
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [{ isOver: isCustomerOver }, removeFromPlannerRef] = useDrop({
    accept: "planner",
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  
  const moveCustomer = async (item) => {
    console.log(item);
    if (item && item.type === "customer") {
      //Accepting customer into the planner table

      //get currentlydragged row data
      setUpdateplanner((_customer) => [..._customer, allCustomers[item.index]])
      console.log(updatePlanner)
     


        await axios.post("/api/planner", {updatePlanner}).then(response=>{
            console.log(response)
            console.log(response.data)
          

            if(response.data === 'success'){

              // add item to planner table
              setPlanner((_planner) => [..._planner, allCustomers[item.index]]);
              
              fetchData()
              setError('successfully inserted')
              // setError('')
    
            }else if (response.data === 'failure') {
              console.log('maddddddddddddddddd')
              setError("Error inserting, please try again")
            }
        }).catch(e=>{
            console.log(e)
        })
  
    } 
   
  };

  console.log(updatePlanner)

  const dragHoverTableBG = isOver ? "bg-warning" : "bg-light";
  const dragHoverPlannerBG = isCustomerOver ? "bg-warning" : "bg-light";


  async function fetchData() {
    try {
      const customers = await axios.get("/api/customers")
      const planner = await axios.get("/api/planner")
      var customersJSON = customers.data
      var plannerJSON = planner.data
      setAllCustomers(()=>customersJSON) //Planner Table
      setPlanner(plannerJSON)   //full customers table
    
    } catch (error) {
      console.error(error);
      setError(error)
    }
  }


  return (customersJSON &&
    <>
      <div className="container" />

      
          <h2>Planner Selection (Customer Drag And Drop)</h2>
            <div className="statecheck">{error}</div>
          
          
          <div className="column">
            <div className={`${dragHoverPlannerBG}`}>
            
              <div className="title">CUSTOMER LISTS</div>
          
              <div className="data" ref={removeFromPlannerRef}>

                <table>
                  <thead className="heading">
                    
                    <tr>
                      <th>Id</th>
                      <th className="customer-name" style={{width:"100%"}}>Customer_Name</th>
                      <th>Pick_Up_Location</th>
                      <th>Drop_off_Location</th>
                    </tr>

                  </thead>
                  <tbody>
                    
                      {allCustomers.map((customer, idx) => (

                        <Customer 
                          {...customer}
                          key={customer.id}
                          index={idx}
                          customerType="customer"
                          onDropCustomer={moveCustomer}
                        />
                      ))}

                    

                  </tbody>
                </table>



              </div>
            </div>
            <div className={`${dragHoverTableBG}`}>
             
                <div className="title">PLANNER</div>
               
           
              <div className="data" ref={addToPlannerRef}>

                <table>
                  <thead className="heading">
                  <tr >
                      
                      <th>Id</th>
                      <th className="customer-name">Customer_Name</th>
                      <th>Pick_Up_Location</th>
                      <th>Drop_off_Location</th>
                      <th>date</th>
                    </tr>
                    
                  </thead>
                
                  <tbody>

                  {planner.map((customer, idx) => (
                  <Customer
                    {...customer}
                    key={customer.id}
                    index={idx}
                    customerType="planner"
                    onDropCustomer={moveCustomer}
                  />
                ))}
                   


                  </tbody>

                </table>


                
              </div>
            </div>
         
        </div>
    
    </>
  );
};

const Customer = ({
  Customer_Name,
  Pick_Up_Location,
  Drop_off_Location,
  date,
  index,
  customerType,
  onDropCustomer,
}) => {

  
  const [{ isDragging }, dragRef] = useDrag({
    item: {
      type: customerType,
      index,
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();

      if (item && dropResult) {
        onDropCustomer(item);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
          
            <tr className="data-row" ref={dragRef} >
            
              <td className="padding-right" >{index}</td>
              <td>{Customer_Name}</td>
              <td >{Pick_Up_Location}</td>
              <td >{Drop_off_Location}</td>
              <td >{date}</td>

            </tr>
 
  );
};
export default PlannerSelection;
