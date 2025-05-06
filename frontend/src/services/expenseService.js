import { supabase } from './supabaseClient'; // update path if needed

// Get all expenses for the logged-in user
export const fetchExpenses = async () => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Add a new expense
export const addExpense = async (expense) => {
    const { data, error } = await supabase
    .from('expenses')
    .insert([expense])
    .select(); // remove .single()
  
  if (error) throw error;
  return data[0]; // return first inserted row

};

// Update an existing expense
export const updateExpense = async (id, updatedExpense) => {
        const { data, error } = await supabase
          .from('expenses')
          .update(updatedExpense)
          .eq('id', id)
          .select()       
          .single();      
      
        if (error) throw error;
        return data;      
      };


// Delete an expense
export const deleteExpense = async (id) => {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw error;
};
