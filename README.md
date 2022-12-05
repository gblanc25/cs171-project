<b>Higher Ed and the Case for Public School Funding</b>

Our project examines Census Bureau data concerning the allocation of funding to elementary schools and the distribution of educational outcomes in each state to determine if funding correlates with better educational attainment. We further examine the broader impact of socioeconomic status on school funding and educational attainment, and urge viewers to advocate for better funding and services within their local governments. 

[Link to project website](https://gblanc25.github.io/public-school-funding)

[Link to project video](https://youtu.be/Njn7AN9JN3k)

Below, we outline documentation for each of our four main visuals. All of these visuals are our own code (though they do use some outside functions), and the only main use of a separate library is <b>fullpage.js</b> for the template and scrolling features on our site. A description of our data can be found in the data folder. 

<hr>

<b>Funding Map: Slides 1-4</b>

We first present viewers with a general map of funding per state, which they can examine by clicking on the "Total", "Federal", "State", and "Local" buttons to change the funding type, and by hovering over states to see a tooltip with more detailed funding information. 

Since it seems like overall funding correlates strongly with population, in the next slide we offer a better comparison involving per-student funding. Users can navigate this visual in the same way as the last slide, except now when users select a funding type, the Bar Chart on the right automatically updates. 

<hr>

<b>Outcomes Scatterplot: Slides 5-6</b>

Now that the user knows how funding is distributed across states, they may be wondering if that funding could actually lead to better educational outcomes. We present them with a scatterplot that has two stages. 

1) When the user first encounters the visual, they see a graph of total per-student funding vs. Bachelor's Degree Attainment among 18-24 year olds with an upward trend, suggesting that states with more funding tend to have better Bachelor's Degree attainment. Users can hover over each circle to see the name of each associated state. 
2) After clicking "Next", the user can compare federal, state, and local types of funding to see that the local funding has the strongest upward trend, and may be most impactful on educational attainment. They can change which data points are displayed using the checkboxes above the graph, and they can select "Restart" to navigate back to the graph of total funding. 

<hr>

<b>Bricks Visualization: Slides 7-8</b>

Though the user now knows that local funding correlates with better outcomes, they may be curious about the full makeup of individual states, especially since among 18-24 year olds, many are still in college. They can use the "Select State" buttons to reveal a Modal (sourced from Bootstrap) that contains a graph of funding by state, on which they can select a state whose data they want to investigate. Bricks representing the proportion of each outcome type then appear, along with data above the graph. 

We point out that some states do have expected gaps in educational attainment if they have high differences in funding, but we also note that there is some variance among states who distribute funding differently, or who even have higher local funding, and have data that does not fully support their expected outcomes. 

<hr>

<b>Sankey Visualization: Slides 9-15</b>

Here, we try to explain that variance in two ways: by noting that socioeconomic status is a broader trend that influences both local funding and the pursuit of higher education (so looking at funding alone is flawed), and that other factors (like cultural beliefs) may also play a role in whether a student continues into higher education. 

We do so via a Sankey Chart that demonstrates how states with higher median incomes (thus higher socioeconomic statuses) often have higher educational attainment, and the same occurs with lower socioeconomic status. Users can hover over each of the lines on the Sankey Chart to see a tooltip display on the right containing information about both income and attainment. 

In the last few slides, we highlight two pairs of states that behave differently than expected (as can be seen in the Bricks visualization as well) in order to acknowledge the impact of outside factors. 

<hr>

We conclude with a few slides encouraging viewers to advocate within their local governments for higher educational funding and better public services (the two factors we've shown to correlate with higher educational outcomes) to help improve attainment in higher education. 

Thank you for viewing our project!



