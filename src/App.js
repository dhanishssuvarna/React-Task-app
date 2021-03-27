import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import About from './components/About';
import AddTask from './components/AddTask';
import Footer from './components/Footer';
import Header from './components/Header';
import Tasks from './components/Tasks';

const App = () => {
    const [showAddTask, setshowAddTask] = useState(false);

    const [tasks, setTasks] = useState([]);

    // Fetch Tasks from DB

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await fetch('http://localhost:5000/tasks');
        const data = await response.json();
        // //console.log(data);
        setTasks(data);
    };

    // Add new Task

    const addTask = async (task) => {
        // //console.log(task);
        const response = await fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(task),
        });

        const data = await response.json();
        setTasks([...tasks, data]);

        // ! Remove async from addTask function and uncomment the commented line
        // ! and comment the uncommented line to add task without updating the DataBase
        // ! In this mode changes made will be lost once we refresh

        // const id = Math.floor(Math.random() * 100000) + 1;
        // const newTask = { id, ...task };
        // setTasks([...tasks, newTask]);
    };

    // Delete Task
    const deleteTask = async (id) => {
        // //console.log('delete', id);
        // This will delete and upadte the dataBase
        await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'DELETE',
        });
        // Displays Updated tasks on web site
        setTasks(tasks.filter((task) => task.id !== id));
    };

    // Toggle Reminder (Double click functionality on tasks to reset the reminder)
    // Fetch Task
    const fetchTask = async (id) => {
        const response = await fetch(`http://localhost:5000/tasks/${id}`);
        const data = await response.json();
        return data;
    };

    const toggleReminder = async (id) => {
        const taskToToggle = await fetchTask(id);
        const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

        const res = await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(updTask),
        });

        const data = await res.json();

        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, reminder: data.reminder } : task
            )
        );

        // setTasks(
        //     tasks.map((task) =>
        //         task.id === id ? { ...task, reminder: !task.reminder } : task
        //     )
        // );
    };

    return (
        <Router>
            <div className='container'>
                <Header
                    onAdd={() => setshowAddTask(!showAddTask)}
                    showAdd={showAddTask}
                />

                <Route
                    path='/'
                    exact
                    render={(props) => (
                        <>
                            {showAddTask && <AddTask onAdd={addTask} />}
                            {tasks.length > 0 ? (
                                <Tasks
                                    tasks={tasks}
                                    onDelete={deleteTask}
                                    onToggle={toggleReminder}
                                />
                            ) : (
                                <h3>No Tasks To Do</h3>
                            )}
                        </>
                    )}
                />

                <Route path='/about' component={About} />
                <Footer />
            </div>
        </Router>
    );
};

export default App;
