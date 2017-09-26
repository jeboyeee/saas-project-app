Rails.application.routes.draw do
  
  resources :tenants do #this project we want to be within tenant / became a nested routes for projects
   resources :projects
  end
  # root 'home#index' - removed because milia will write its own version of it
  resources :members
  get 'home/index'

   root :to => "home#index"

    
  # *MUST* come *BEFORE* devise's definitions (below)
  as :user do   
    match '/user/confirmation' => 'confirmations#update', :via => :put, :as => :update_user_confirmation
  end

  devise_for :users, :controllers => { 
    :registrations => "milia/registrations",
    :confirmations => "confirmations",
    :sessions => "milia/sessions", 
    :passwords => "milia/passwords", 
  }


  
  
  
  
 
end
