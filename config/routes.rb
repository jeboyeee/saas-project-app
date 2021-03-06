Rails.application.routes.draw do
  
  resources :user_projects
  resources :artifacts
  resources :tenants do #this project we want to be within tenant / became a nested routes for projects
   resources :projects do
     get 'users', on: :member #add after user project created
     put 'add_user', on: :member
   end
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
    # :registrations => "milia/registrations",
    :registrations => "registrations",
    :confirmations => "confirmations",
    :sessions => "milia/sessions", 
    :passwords => "milia/passwords", 
  }
  
  match '/plan/edit' => 'tenants#edit', via: :get, as: :edit_plan
  match '/plan/update' => 'tenants#update', via: [:put, :patch], as: :update_plan


  
  
  
  
 
end
